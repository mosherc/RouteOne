import { CreateStateHandler } from "ask-sdk-v1adapter";
import { INTENTS } from "../constants/intents";
import { STATES } from "../constants/states";
import { unhandledHandler, exitHandler, startOverHandler, bicycleHandler } from "../handlers";

export const askQuestionHandlers = CreateStateHandler(STATES.ASKMODE, {
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});