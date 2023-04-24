import { CreateStateHandler } from "alexa-sdk";
import { INTENTS } from "../constants/intents";
import { helpBattle } from "../constants/messages";
import { STATES } from "../constants/states";
import { chooseMoveHandler, HandlerThis, unhandledHandler, exitHandler, startOverHandler, bicycleHandler, checkPokeHandler } from "../handlers";

export const chooseMoveHandlers = CreateStateHandler(STATES.CHOOSEMOVEMODE, {
  [INTENTS.CHOOSE_MOVE]: chooseMoveHandler,
  [INTENTS.BACK]: function (this: HandlerThis) {
    const response = helpBattle;
    this.handler.state = STATES.BATTLEMODE;
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