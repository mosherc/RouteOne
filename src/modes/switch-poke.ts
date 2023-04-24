import { CreateStateHandler } from "alexa-sdk";
import { INTENTS } from "../constants/intents";
import { helpBattle } from "../constants/messages";
import { STATES } from "../constants/states";
import { HandlerThis, unhandledHandler, exitHandler, startOverHandler, bicycleHandler, checkPokeHandler } from "../handlers";
import { helper } from "../helper";
import { AvailablePokemon } from "../constants/pokemon";

export const switchPokeHandlers = CreateStateHandler(STATES.SWITCHPOKEMODE, {
  [INTENTS.SWITCH]: function (this: HandlerThis) {
    const { party, playerName, opponentParty, opponentName } = this.attributes;
    let response = '';
    let pokeIndex;
    let switchedInPokemon;

    // const healthyArr = helper.getHealthyParty(party);

    // need to make sure a name is said...
    const pokeKey = helper.screamingSnake<AvailablePokemon>(this.event.request.intent.slots.Pokemon.value);
    const requestedPoke = helper.getPokemonByKey(pokeKey);
    for (pokeIndex = 0; pokeIndex < party.length; pokeIndex++) {
      if (party[pokeIndex].name === requestedPoke.name && party[pokeIndex].stats.hp > 0) {
        switchedInPokemon = party[pokeIndex];
        break;
      }
    }
    //        switchIn = party[switchInName];
    if (!switchedInPokemon) {
      response = `You don't have a healthy ${requestedPoke.name}! ${helper.modeAvailableActions(this.attributes, this.handler.state)}`;
      return this.emit(':ask', response, response);
    }

    helper.switchPokemon(party, 0, pokeIndex);
    // need to say pokemon switched, trainer switched out party[pokeIndex] for part[0]
    response += `${playerName} took out ${party[pokeIndex].name}, and put in ${party[0].name}. `;
    // switchPokemon: function(party, p1, p2) p1 and p2 are indeces
    const [poke] = party;

    // opponent attacks
    if (!opponentParty || !opponentName) {
      throw new Error('opponentParty or opponentName is undefined in SwitchPokemonIntent');
    }
    const opp = opponentParty[0];
    const oppMove = opp.moveSet[helper.generateRandomInt(0, 3)];
    response += helper.attack(opp, poke, oppMove);

    // check if faint
    const isFaineted = helper.isFainted(this.attributes, poke, true);
    response += isFaineted.response;

    this.emit(':ask', response, response);
  },
  [INTENTS.BACK]: function (this: HandlerThis) {
    this.handler.state = STATES.BATTLEMODE;
    const response = helpBattle;
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