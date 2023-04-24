import { CreateStateHandler } from "alexa-sdk";
import { INTENTS } from "../constants/intents";
import { STATES } from "../constants/states";
import { HandlerThis, exitHandler, startOverHandler, unhandledHandler } from "../handlers";
import { helpNameHandler } from "../handlers/helpNameHandler";
import { helper } from "../helper";

export const askNameHandlers = CreateStateHandler(STATES.NAMEMODE, {
  [INTENTS.NAME]: function (this: HandlerThis) {
    const slot = this.event.request.intent.slots.Name.value;
    const playerName = slot;
    this.attributes.playerName = playerName;
    const response = helper.speakAsOak(
      `Right… So your name is ${playerName}. This is my grandson. He's been your rival since you both were babies. …Erm, what was his name now?`,
      this.attributes.isOakJapanese,
    );
    this.handler.state = STATES.RIVALMODE;
    this.emit(':ask', response, response);
  },
  [INTENTS.HELP]: helpNameHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});