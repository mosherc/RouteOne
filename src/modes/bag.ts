import { CreateStateHandler } from "ask-sdk-v1adapter";
import { ballShakeSound, pokemonCaughtSound } from "../constants/audio";
import { INTENTS } from "../constants/intents";
import { AvailableItems, Item, ITEMS } from "../constants/items";
import { invalidItemMessage, invalidPokemonMessage, helpBattle, welcomePokeCenter, welcomePokeMart, helpMovement } from "../constants/messages";
import { AvailablePokemon, Pokemon } from "../constants/pokemon";
import { STATES } from "../constants/states";
import { HandlerThis, unhandledHandler, exitHandler, startOverHandler, bicycleHandler, checkPokeHandler } from "../handlers";
import { helper } from "../helper";

export const bagHandlers = CreateStateHandler(STATES.BAGMODE, {
  [INTENTS.USE_ITEM]: function (this: HandlerThis) {
    let response = '';
    const item = helper.screamingSnake<AvailableItems>(this.event.request.intent.slots.Item.value);
    const pokeSlot = helper.screamingSnake<AvailablePokemon | undefined>(this.event.request.intent.slots.Pokemon.value);
    const { playerName, party, opponentParty, opponentName, sex } = this.attributes;
    let poke: Pokemon | undefined;

    // need to check if Pokemon is defined, not always necessary
    if (typeof pokeSlot === 'undefined') {
      [poke] = party;
    } else {
      poke = party.find((p) => p.name === pokeSlot);
    }

    let chosenItem: Item | null = null;
    // need to check if this item exists
    if (typeof ITEMS[item] === 'undefined') {
      response += invalidItemMessage;
      return this.emit(':ask', response, response);
    }
    chosenItem = ITEMS[item];

    // need to check if pokemon is in the party
    if (!poke) {
      response += invalidPokemonMessage;
      return this.emit(':ask', response, response);
    }
    if (chosenItem.count < 1) {
      response += 'You do not have any of this item left! Say another item.';
      this.emit(':ask', response, response);
    }

    response += `${playerName} used ${chosenItem.name}! `;

    if (this.attributes.battle === null && poke) {
      // we are in peaceful state
      // use item, can't use ball though
      if (chosenItem.type === 'BALL') {
        response += "Can't use a Pokieball here! Select a different item or go back.";
      } else if (chosenItem.type === 'HEALING') {
        chosenItem.count--;
        poke.stats.hp = Math.min(poke.stats.hp + chosenItem.hp, helper.getMaxHp(poke));
      } else if (chosenItem.type === 'RESTORE') {
        chosenItem.count--;
        poke.stats.hp = Math.min(poke.stats.hp + chosenItem.hp, helper.getMaxHp(poke));
        poke.status = null;
      }
      this.handler.state = this.attributes.prevState;
      this.attributes.prevState = null;
    } else if (chosenItem.type === 'BALL') {
      if (!opponentParty || !opponentName) {
        throw new Error('opponentParty is undefined in UseItemIntent');
      }
      const opp = opponentParty[0];
      if (this.attributes.battle === 'wild' && opp != null) {
        chosenItem.count--;
        // do the pokeball stuff here
        const hpMax = helper.getMaxHp(opp);
        const hpCurr = opp.stats.hp;
        const rate = opp.catchRate;
        const bonusBall = chosenItem.catchRate;
        const bonusStatus = helper.getStatusMult(opp);
        const a = ((3 * hpMax - 2 * hpCurr) * rate * bonusBall * bonusStatus) / (3 * hpMax);
        const b = Math.floor(1048560 / Math.floor(Math.sqrt(Math.floor(Math.sqrt(Math.floor(16711680 / a))))));

        let rand;
        let shake;
        for (shake = 0; shake < 4; shake++) {
          rand = helper.generateRandomInt(0, 65535);
          if (b >= rand) {
            break;
          }
          // play pokeball shake sound effect!
          response += shake < 4 ? ballShakeSound : `<break time='1s'/>${pokemonCaughtSound}`;
        }
        if (a >= 255 || shake === 4) {
          // pokemon is caught
          response += helper.speakAsPlayer(`Gotcha! ${opp.name} was caught!`, sex);
          // if party is full, add to PC, else add to party
        } else {
          // pokemon was not caught
          // switch between different responses like "argh so close!"
          switch (shake) {
            case 0:
              response += 'Oh, no! The Pokemon broke free!';
              break;
            case 1:
              response += 'Aww! It appeared to be caught!';
              break;
            case 2:
              response += 'Aargh! Almost had it!';
              break;
            case 3:
              response += 'Shoot! It was so close too!';
              break;
            default:
          }
          response = helper.speakAsPlayer(response, sex);
          // wild poke attacks
          const oppMove = opp.moveSet[helper.generateRandomInt(0, opp.moveSet.length - 1)];
          response += helper.attack(opp, poke, oppMove);
          const faintRes = helper.isFainted(this.attributes, poke, true);
          this.handler.state = faintRes.state;
          response += faintRes.response;
        }
      } else {
        response = "You can't use a Pokéball on an trainer Pokemon! Chose another item or go back!";
      }
    } else {
      if (!opponentParty || !opponentName) {
        throw new Error('opponentParty is undefined in UseItemIntent');
      }
      const opp = opponentParty[0];
      chosenItem.count--;
      // use item first
      if (chosenItem.type === 'HEALING') {
        poke.stats.hp = Math.min(poke.stats.hp + chosenItem.hp, helper.getMaxHp(poke));
      } else if (chosenItem.type === 'RESTORE') {
        poke.stats.hp = Math.min(poke.stats.hp + chosenItem.hp, helper.getMaxHp(poke));
        poke.status = null;
      }

      // opponent attacks
      const oppMove = opp.moveSet[helper.generateRandomInt(0, opp.moveSet.length - 1)];
      response += helper.attack(opp, poke, oppMove);
      const faintRes = helper.isFainted(this.attributes, poke, true);
      this.handler.state = faintRes.state;
      response += faintRes.response;
    }
    this.emit(':ask', response, response);
  },
  [INTENTS.BACK]: function (this: HandlerThis) {
    let response;
    const { prevState } = this.attributes;
    if (prevState === null) {
      this.handler.state = STATES.BATTLEMODE;
      response = `What would you like to do next? ${helpBattle}`;
    } else {
      this.handler.state = prevState;
      response = helper.modeAvailableActions(this.attributes, this.handler.state);
      this.attributes.prevState = null;
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