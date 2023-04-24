import { CreateStateHandler } from "alexa-sdk";
import { getGender } from "gender-detection-from-name";
import { INTENTS } from "../constants/intents";
import { STATES } from "../constants/states";
import { HandlerThis, exitHandler, startOverHandler, unhandledHandler } from "../handlers";
import { helpNameHandler } from "../handlers/helpNameHandler";
import { helper } from "../helper";

export const askRivalHandlers = CreateStateHandler(STATES.RIVALMODE, {
  [INTENTS.NAME]: function (this: HandlerThis) {
    const { playerName, isOakJapanese } = this.attributes;
    const slot = this.event.request.intent.slots.Name.value;
    let response = '';
    if (slot.toLowerCase() === playerName.toLowerCase()) {
      response = helper.speakAsOak("I don't think you two had the same name...Erm, what was his real name now?", isOakJapanese);
    } else {
      const rivalName = slot;
      this.attributes.rivalName = rivalName;
      const rivalSex = getGender(rivalName) === 'female' ? 'girl' : 'boy';
      this.attributes.rivalSex = rivalSex;
      this.attributes.rivalPronouns = helper.getPronouns(this.attributes.rivalSex);
      response = helper.speakAsOak(
        `…Er, was it ${rivalName}? Thats right! I remember now! ${this.attributes.rivalPronouns.possessive} name is ${rivalName}! ${
          rivalSex === 'girl' ? 'Oh and yes, I forgot she is a girl!' : ''
        } ${playerName}! Your own very Pokémon legend is about to unfold! A world of dreams and adventures with Pokémon awaits! Lets go! <break/>`,
        isOakJapanese,
      );
      response += 'You speak with mom and she says: <break/>';
      response += helper.speakAsMom(`...Right. All ${this.attributes.sex}s leave home someday. It said so on TV. Professor Oak next door is looking for you.`);
      response += `Are you ready to continue to the lab?`;
      this.handler.state = STATES.MOVEMENTMODE;
    }
    this.emit(':ask', response, response);
  },
  [INTENTS.HELP]: helpNameHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});