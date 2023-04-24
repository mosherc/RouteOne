import { CreateStateHandler } from "alexa-sdk";
import { INTENTS } from "../constants/intents";
import { helpMovement } from "../constants/messages";
import { STATES } from "../constants/states";
import { chooseLocationHandler, bagHandler, trainHandler, HandlerThis, exitHandler, startOverHandler, bicycleHandler, unhandledHandler, checkPokeHandler } from "../handlers";

export const askLocationHandlers = CreateStateHandler(STATES.CHOOSELOCATIONMODE, {
  [INTENTS.CHOOSE_LOC]: chooseLocationHandler,
  [INTENTS.BAG]: bagHandler,
  [INTENTS.TRAIN]: trainHandler,
  [INTENTS.HELP]: function (this: HandlerThis) {
    this.emit(':ask', helpMovement, helpMovement);
  },
  [INTENTS.CHECK_POKE]: checkPokeHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});