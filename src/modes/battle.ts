import { CreateStateHandler } from "alexa-sdk";
import { INTENTS } from "../constants/intents";
import { helpBattle, helpMovement } from "../constants/messages";
import { STATES } from "../constants/states";
import { HandlerThis, chooseMoveHandler, bagHandler, exitHandler, startOverHandler, bicycleHandler, unhandledHandler, checkPokeHandler } from "../handlers";
import { helper } from "../helper";

export const battleHandlers = CreateStateHandler(STATES.BATTLEMODE, {
  // TODO - add cheat mode to win battle
  [INTENTS.FIGHT]: function (this: HandlerThis) {
    this.attributes.playerPokemon = this.attributes.party[0];

    this.handler.state = STATES.CHOOSEMOVEMODE;
    const response = helper.modeAvailableActions(this.attributes, this.handler.state);
    this.emit(':ask', response, response);
  },
  [INTENTS.CHOOSE_MOVE]: chooseMoveHandler,
  [INTENTS.SWITCH]: function (this: HandlerThis) {
    let response;
    const { party } = this.attributes;

    // create healthy pokemon subarray
    const healthyArr = helper.getHealthyParty(party);
    const healthy = healthyArr.join(' ');
    if (healthyArr.length > 1) {
      response = `You have the following healthy Pokemon: ${healthy}. Say 'switch' and the name of the Pokemon.`;
      this.emit(':ask', response, response);
    } else if (healthyArr.length === 1) {
      response = `You don't have any other healthy Pokemon! ${helpBattle}`;
      this.emit(':ask', response, response);
    }
  },
  [INTENTS.BAG]: bagHandler,
  [INTENTS.RUN]: function (this: HandlerThis) {
    let response;
    if (this.attributes.battle !== 'wild') {
      response = `Can't run away from enemy battle! ${helpBattle}`;
    } else {
      response = `Ran away safely! ${helpMovement}`;
      this.handler.state = STATES.MOVEMENTMODE;
    }
    this.emit(':ask', response, response);
  },
  [INTENTS.HELP]: function (this: HandlerThis) {
    this.emit(':ask', helpBattle, helpBattle);
  },
  [INTENTS.CHECK_POKE]: checkPokeHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});