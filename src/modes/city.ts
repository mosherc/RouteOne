import { CreateStateHandler } from "alexa-sdk";
import { INTENTS } from "../constants/intents";
import { welcomePokeCenter, welcomePokeMart } from "../constants/messages";
import { STATES } from "../constants/states";
import { HandlerThis, chooseLocationHandler, bagHandler, unhandledHandler, exitHandler, startOverHandler, bicycleHandler, checkPokeHandler } from "../handlers";
import { helper } from "../helper";

export const cityHandlers = CreateStateHandler(STATES.CITYMODE, {
  [INTENTS.POKE_CENTER]: function (this: HandlerThis) {
    this.handler.state = STATES.POKECENTERMODE;
    const response = helper.speakAsNurse(welcomePokeCenter);
    this.emit(':ask', response, response);
  },
  [INTENTS.POKE_MART]: function (this: HandlerThis) {
    this.handler.state = STATES.POKEMARTMODE;
    const response = helper.speakAsMart(welcomePokeMart);
    this.emit(':ask', response, response);
  },
  [INTENTS.LEAVE]: function (this: HandlerThis) {
    this.handler.state = STATES.CHOOSELOCATIONMODE;
    const response = `Where would you like to go next? There is ${helper.getAdjacentLocations(this.attributes.location)}`;
    this.emit(':ask', response, response);
  },
  [INTENTS.CHECK_POKE]: checkPokeHandler,
  [INTENTS.CHOOSE_LOC]: chooseLocationHandler,
  [INTENTS.BAG]: bagHandler,
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});