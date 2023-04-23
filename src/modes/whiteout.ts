import { CreateStateHandler } from "ask-sdk-v1adapter";
import { INTENTS } from "../constants/intents";
import { welcomePokeCenter } from "../constants/messages";
import { STATES } from "../constants/states";
import { HandlerThis, unhandledHandler, exitHandler, startOverHandler, bicycleHandler, checkPokeHandler } from "../handlers";
import { helper } from "../helper";

export const whiteOutHandlers = CreateStateHandler(STATES.WHITEOUTMODE, {
  [INTENTS.YES]: function (this: HandlerThis) {
    const { playerName, party, isOakJapanese, lastVisitedCity, rivalSex } = this.attributes;
    let response;

    // heal party because whited out
    if (this.attributes.storyProgression <= 2) {
      response = helper.speakAsRival(
        `Yeah! Am I great or what! <break />`,
        rivalSex,
      );
      response += helper.speakAsOak(`Hmm...how disappointing...If you win, you earn prize money, and your Pokemon grow. But if you lose, ${playerName}, you end up paying prize money...However since you had no warning this time, I'll pay for you. But things won't be this way once you step out these doors. That's why you must strengthen your Pokemon by battling wild Pokemon. <break />`, isOakJapanese);
      response += helper.speakAsRival(`I'll make my Pokemon battle to toughen it up! ${playerName}! Gramps! Smell ya later! <break />`, rivalSex)
      response += `Would you like to continue on your journey?`;
      helper.healTeam(party);
      this.handler.state = STATES.MOVEMENTMODE;
    } else {
      // end up back at pokemon center
      // battle is over
      this.handler.state = STATES.POKECENTERMODE;
      this.attributes.location = lastVisitedCity;
      response = `Your nearly dead body was transported back to ${lastVisitedCity.name} by Nurse Joy. <break />`;
      response += helper.modeAvailableActions(this.attributes, this.handler.state);
    }
    this.emit(':ask', response, response);
  },
  [INTENTS.CHECK_POKE]: checkPokeHandler,
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});