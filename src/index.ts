/**
 * This skill is a Pokemon adventure game built with the Amazon Alexa Skills Kit.
 */

import Alexa from 'alexa-sdk';
import { getGender } from 'gender-detection-from-name';
import { AvailablePokemon, Pokemon } from './constants/pokemon';
import { AvailableItems, ITEMS, Item } from './constants/items';
import { LOCATIONS } from './constants/locations';
import { HandlerThis, Sex } from './handlers/HandlerThis';
import { STATES } from './constants/states';
import { helper } from './helper';
import { bagHandler } from './handlers/bagHandler';
import {
  helpBattle,
  helpChoosePokemon,
  helpMessage,
  helpMovement,
  repeatChooseSex,
  unhandledPokemon,
  unhandledSex,
  welcomeMessage,
  goodbyeMessage,
  invalidItemMessage,
  invalidPokemonMessage,
  welcomePokeCenter,
  seeYouAgainPokeCenter,
  pokeCenterNextLocation,
  unchosenItem,
  notEnoughMoney,
  welcomePokeMart,
} from './constants/messages';
import { unhandledHandler } from './handlers/unhandledHandler';
import { bicycleHandler } from './handlers/bicycleHandler';
import { startOverHandler } from './handlers/startOverHandler';
import { exitHandler } from './handlers/exitHandler';
import { helpSexHandler } from './handlers/helpSexHandler';
import { helpNameHandler } from './handlers/helpNameHandler';
import { trainHandler } from './handlers/trainHandler';
import { ballShakeSound, healSound, pokemonCaughtSound, rivalBattleSound } from './constants/audio';
import { chooseMoveHandler } from './handlers/chooseMoveHandler';
import { chooseLocationHandler } from './handlers/chooseLocationHandler';
import { INTENTS } from './constants/intents';

// --------------- Handlers -----------------------

// set state to start up and  welcome the user
const newSessionHandler = {
  [INTENTS.LAUNCH]: function (this: HandlerThis) {
    this.handler.state = STATES.STARTMODE;
    this.attributes.goodbyeMessage = goodbyeMessage;
    this.attributes.storyProgression = 0;
    this.attributes.money = 0;
    this.attributes.bag = ITEMS;
    this.attributes.party = [];
    this.attributes.chosenItem = null;
    this.attributes.location = LOCATIONS.PALLET_TOWN;
    this.attributes.lastVisitedCity = LOCATIONS.PALLET_TOWN;
    const isOakJapanese = helper.generateRandomInt(0, 100) < 25;
    this.attributes.isOakJapanese = isOakJapanese;
    // determine oak's race
    this.emit(':ask', helper.speakAsOak(welcomeMessage, isOakJapanese), helper.speakAsOak(unhandledSex, isOakJapanese));
  },
  [INTENTS.HELP]: function (this: HandlerThis) {
    this.handler.state = STATES.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  [INTENTS.UNHANDLED]: function (this: HandlerThis) {
    this.handler.state = STATES.STARTMODE;
    const { isOakJapanese } = this.attributes;
    this.emit(':ask', helper.speakAsOak(unhandledSex, isOakJapanese), helper.speakAsOak(repeatChooseSex, isOakJapanese));
  },
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
const startGameHandlers = Alexa.CreateStateHandler(STATES.STARTMODE, {
  [INTENTS.SKIP]: function (this: HandlerThis) {
    this.handler.state = STATES.CHOOSEPOKEMONMODE;
    this.attributes.playerName = 'Red';
    this.attributes.sex = 'boy';
    this.attributes.rivalName = 'Blue';
    this.attributes.rivalSex = 'boy';
    this.attributes.rivalPronouns = helper.getPronouns('boy');
    this.attributes.storyProgression = 2;
    let response = helper.speakAsOak("A little impatient, are we? Anyway, Do you choose Bulbasaur, the grass Pokemon, Charmander, the fire Pokemon, or Squirtle, the water Pokemon?", this.attributes.isOakJapanese);
    this.emit(':ask', response, response);
  },
  [INTENTS.SEX]: function (this: HandlerThis) {
    this.attributes.sex = this.event.request.intent.slots.Sex.value as Sex;
    const response = helper.speakAsOak("Let's begin with your name. What is it?", this.attributes.isOakJapanese);
    // set state to asking name
    this.handler.state = STATES.NAMEMODE;

    // ask the next question
    this.emit(':ask', response, response);
  },
  [INTENTS.NO]: exitHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: helpSexHandler,
  [INTENTS.HELP]: helpSexHandler,
  [INTENTS.UNHANDLED]: function (this: HandlerThis) {
    const response = helper.speakAsOak(unhandledSex, this.attributes.isOakJapanese);
    this.emit(':ask', response, response);
  },
});

const askNameHandlers = Alexa.CreateStateHandler(STATES.NAMEMODE, {
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

const askRivalHandlers = Alexa.CreateStateHandler(STATES.RIVALMODE, {
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

const askMovementHandlers = Alexa.CreateStateHandler(STATES.MOVEMENTMODE, {
  [INTENTS.YES]: function (this: HandlerThis) {
    const { playerName, rivalName, storyProgression, location, rivalPronouns, rivalSex, isOakJapanese, party } = this.attributes;
    let response;
    let reprompt;

    // hard code story lines tied to movement states?
    if (storyProgression === 0) {
      response = `You see your rival in the lab and ${rivalPronouns.subject} says: <break/>`;
      response += helper.speakAsRival(`What? It's only ${playerName}? Gramps isn't around. <break/>`, rivalSex);
      response += 'Would you like to continue to the grass to find some pokemon? <break/>';
      reprompt = helper.speakAsRival('Would you like to go to the grass or are you just gonna stand there, ya dummy?', rivalSex);
      this.attributes.storyProgression++;
    } else if (storyProgression === 1) {
      response = helper.speakAsOak(
        `Hey! Wait! Don't go out! It's unsafe! Wild Pokemon live in tall grass! You need your own Pokemon for your protection. I know! Come with me! <break/>`,
        isOakJapanese,
      );
      response += `You follow Oak to the lab. <break/>`;
      response += helper.speakAsRival(`Gramps! I'm fed up with waiting! <break/>`, rivalSex);
      response += helper.speakAsOak(
        `${rivalName}? Let me think… Oh, that's right, I told you to come! Here, ${playerName}! There are three Pokémon here. Haha! The Pokémon are held inside these Pokéballs. You can have one. Go on, choose! <break/>`,
        isOakJapanese,
      );
      response += helper.speakAsRival(`Hey! Gramps! No fair! What about me? <break/>`, rivalSex);
      response += helper.speakAsOak(
        `Be patient ${rivalName}! Do you choose Bulbasaur, the grass Pokemon, Charmander, the fire Pokemon, or Squirtle, the water Pokemon? <break/>`,
        isOakJapanese,
      );
      reprompt = helper.speakAsOak('Come on, choose a Pokemon already. Stupid kids...', isOakJapanese);
      this.handler.state = STATES.CHOOSEPOKEMONMODE;
      this.attributes.storyProgression++;
    } else if (storyProgression >= 2) {
      // within a storyProgression, the player should be able to say YES to continue to next Alexa State, or no (or something else) to stay within the storyProgression and MOVEMENTMODE
      const randAction = helper.randomAction(location);
      console.log({randAction});
      const pokemon = location.type === 'ROUTE' ? helper.generateRandomPoke(location, party) : null;
      if (randAction === 'trainer') {
        this.attributes.battle = 'trainer'; // can also be "trainer" for trainer battle, or "wild" for wild battle
        const OT = helper.generateOT();
        this.attributes.opponentName = OT;
        this.attributes.opponentParty = helper.generateParty(OT, party);
        this.handler.state = STATES.BATTLEMODE;
        const dialogue = helper.getRandomBattleDialogue(OT);
        this.attributes.opponentVoice = dialogue.voice;
        response = helper.speakWithVoice(dialogue.accostment, dialogue.voice);
        const firstPokemon = this.attributes.opponentParty[0];
        response += `${OT} sent out a level ${firstPokemon.level} ${firstPokemon.name}! `
        response += helpBattle;
      } else if (randAction === 'wild' && pokemon) {
        this.attributes.battle = 'wild'; // can also be "trainer" for trainer battle, or "wild" for wild battle
        this.attributes.opponentName = 'wild';
        this.attributes.opponentParty = [pokemon];
        this.handler.state = STATES.BATTLEMODE;
        response = `Wild ${pokemon.name} appeared! ${helpBattle}`;
      } else if (randAction === 'item') {
        // get item
        const findableItems = location.items;
        const foundItem = findableItems[helper.generateRandomInt(0, findableItems.length - 1)];
        this.attributes.bag[foundItem].count++;
        response = `You found a ${foundItem}! You put it in your bag for safekeeping. ${helpMovement}`;
      } else {
        this.handler.state = STATES.CHOOSELOCATIONMODE;
        response = `You did not encounter any Pokemon in ${location.name}. Where would you like to go next? There is ${helper.getAdjacentLocations(location)}.`;
      }

      this.attributes.storyProgression++;
    }

    this.emit(':ask', response, reprompt);
  },
  [INTENTS.BAG]: bagHandler,
  [INTENTS.TRAIN]: trainHandler,
  [INTENTS.HELP]: function (this: HandlerThis) {
    this.emit(':ask', helpMovement, helpMovement);
  },
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const askLocationHandlers = Alexa.CreateStateHandler(STATES.CHOOSELOCATIONMODE, {
  [INTENTS.CHOOSE_LOC]: chooseLocationHandler,
  [INTENTS.BAG]: bagHandler,
  [INTENTS.TRAIN]: trainHandler,
  [INTENTS.HELP]: function (this: HandlerThis) {
    this.emit(':ask', helpMovement, helpMovement);
  },
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const askPokemonHandlers = Alexa.CreateStateHandler(STATES.CHOOSEPOKEMONMODE, {
  [INTENTS.CHOOSE_POKE]: function (this: HandlerThis) {
    const starter = helper.screamingSnake<AvailablePokemon>(this.event.request.intent.slots.Pokemon.value);
    const { playerName, isOakJapanese } = this.attributes;
    console.log({ starter, slot: this.event.request.intent.slots.Pokemon });
    let response;

    if (starter === 'BULBASAUR') {
      response = `I see! Bulbasaur is your choice. It's very easy to raise. So, ${playerName}, you want to go with the grass Pokemon Bulbasaur?`;
      this.attributes.starter = starter;
    } else if (starter === 'CHARMANDER') {
      response = `Ah! Charmander is your choice. You should raise it patiently. So, ${playerName}, you're claiming the fire Pokemon Charmander?`;
      this.attributes.starter = starter;
    } else if (starter === 'SQUIRTLE') {
      response = `Hm! Squirtle is your choice. It's one worth raising. So, ${playerName}, you've decided on the water Pokemon Squirtle?`;
      this.attributes.starter = starter;
    } else if (starter === 'PIKACHU') {
      response = `Oh! It's name is Pikachu. It's also known as the electric Mouse. It's usually shy, but can sometimes have an electrifying personality. Shocking isn't it? So, Ash, erm...I mean...${playerName}, do you want to be the very best, like no one ever was?`;
      this.attributes.starter = starter;
    } else {
      const undhandledResponse = helper.speakAsOak(unhandledPokemon, isOakJapanese);
      this.emit(':ask', undhandledResponse, undhandledResponse);
    }
    response = helper.speakAsOak(response, isOakJapanese);
    this.emit(':ask', response, response);
  },
  [INTENTS.YES]: function (this: HandlerThis) {
    let rivalStarter: AvailablePokemon;
    const { playerName, rivalName, starter, rivalSex, isOakJapanese } = this.attributes;

    if (typeof this.attributes.starter !== 'undefined') {
      if (starter === 'BULBASAUR') {
        rivalStarter = 'CHARMANDER';
      } else if (starter === 'CHARMANDER') {
        rivalStarter = 'SQUIRTLE';
      } else if (starter === 'SQUIRTLE') {
        rivalStarter = 'BULBASAUR';
      } else {
        rivalStarter = 'EEVEE';
      }
      if (!starter) {
        throw new Error('Starter Pokemon not defined');
      }
      const starterPokemon = helper.generatePokemon(starter, playerName, 5);
      const rivalStarterPokemon = helper.generatePokemon(rivalStarter, rivalName, 5);

      this.attributes.party = [starterPokemon];
      this.attributes.battle = 'first'; // can also be "trainer" for trainer battle, or "wild" for wild battle
      this.attributes.opponentName = rivalName;
      this.attributes.opponentParty = [rivalStarterPokemon];
      // helper.battleSetup(this, playerName, rivalName, "first", [rivalStarter]);

      this.handler.state = STATES.BATTLEMODE;
      let response = `${pokemonCaughtSound} ${playerName} received the ${starterPokemon.name} from Professor Oak! Your rival walks over to the ${rivalStarterPokemon.name}. <break />`;
      response += helper.speakAsRival(`I'll take this one then! <break/>`, rivalSex);
      response += `${rivalName} received the ${rivalStarterPokemon.name} from Professor Oak! <break/>`;
      response += helper.speakAsOak(
        `If a wild Pokemon appears, your pokemon can battle it. With it at your side, you should be able to reach the next town. <break/>`,
        isOakJapanese,
      );
      response += helper.speakAsRival(`Wait, ${playerName}! Let's check out our Pokemon! Come on, I'll take you on! ${rivalBattleSound}`, rivalSex);
      response += `... Rival ${rivalName} would like to battle! Rival ${rivalName} sent out ${rivalStarterPokemon.name}! <break/>`;
      response += helper.speakAsRival(`Go! ${rivalStarterPokemon.name}! <break/>`, rivalSex);
      response += helper.speakAsOak(
        `Oh for Pete's sake...So pushy as always. ${rivalName}. You've never had a Pokemon battle before have you? A Pokemon battle is when Trainers pit their Pokemon against each other. Anyway, you'll learn more from experience. <break/>`,
        isOakJapanese,
      );
      const reprompt = `What will ${playerName} do? You can say either let's fight, switch pokemon, open bag, or run away.`;
      response += reprompt;
      this.emit(':ask', response, reprompt);
    } else {
      const response = helper.speakAsOak('Choose either Bulbasaur, Squirtle, or Charmander.', isOakJapanese);
      this.emit(':ask', response, response);
    }
  },
  [INTENTS.NO]: function (this: HandlerThis) {
    if (typeof this.attributes.starter !== 'undefined') {
      this.attributes.starter = undefined;
      this.emit(':ask', 'Ok, select a different Pokemon');
    } else {
      this.emit(':ask', 'Choose your Pokemon');
    }
  },
  [INTENTS.HELP]: function (this: HandlerThis) {
    this.emit(':ask', helpChoosePokemon, helpChoosePokemon);
  },
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: function (this: HandlerThis) {
    this.emit(':ask', unhandledPokemon, unhandledPokemon);
  },
});

const battleHandlers = Alexa.CreateStateHandler(STATES.BATTLEMODE, {
  [INTENTS.FIGHT]: function (this: HandlerThis) {
    const poke = this.attributes.party[0];
    const moves = poke.moveSet;
    const moveString = moves
      .map(function (move) {
        return move.name;
      })
      .join(', ');

    const response = `Your ${poke.name} knows ${moveString}. Say one of these moves!`;

    this.handler.state = STATES.CHOOSEMOVEMODE;
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
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const chooseMoveHandlers = Alexa.CreateStateHandler(STATES.CHOOSEMOVEMODE, {
  [INTENTS.CHOOSE_MOVE]: chooseMoveHandler,
  [INTENTS.BACK]: function (this: HandlerThis) {
    const response = helpBattle;
    this.handler.state = STATES.BATTLEMODE;
    this.emit(':ask', response, response);
  },
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const switchPokeHandlers = Alexa.CreateStateHandler(STATES.SWITCHPOKEMODE, {
  [INTENTS.SWITCH]: function (this: HandlerThis) {
    let response = '';
    const { party, playerName, opponentParty, opponentName, location, opponentVoice, rivalName, rivalSex } = this.attributes;
    let pokeIndex;

    // const healthyArr = helper.getHealthyParty(party);

    // need to make sure a name is said...
    const switchInName = this.event.request.intent.slots.Pokemon.value;

    for (pokeIndex = 0; pokeIndex < party.length; pokeIndex++) {
      if (party[pokeIndex].name === switchInName) {
        break;
      }
    }
    //        switchIn = party[switchInName];

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
    const response = helpBattle;
    this.handler.state = STATES.BATTLEMODE;
    this.emit(':ask', response, response);
  },
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const bagHandlers = Alexa.CreateStateHandler(STATES.BAGMODE, {
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
      response = `What would you like to do next? ${helpBattle}`;
      this.handler.state = STATES.BATTLEMODE;
    } else {
      this.handler.state = prevState;
      if (prevState === STATES.POKECENTERMODE) {
        response = helper.speakAsNurse(welcomePokeCenter);
      } else if (prevState === STATES.POKEMARTMODE) {
        response = helper.speakAsMart(welcomePokeMart);
      } else if (prevState === STATES.CITYMODE) {
        response = `You close your bag and look at the city. ${helper.getLocationActivities(this.attributes.location)}`;
      } else if (prevState === STATES.MOVEMENTMODE) {
        response = helpMovement;
      }
      this.attributes.prevState = null;
    }
    this.emit(':ask', response, response);
  },
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const whiteOutHandlers = Alexa.CreateStateHandler(STATES.WHITEOUTMODE, {
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
      response += helper.speakAsNurse(welcomePokeCenter);
    }
    this.emit(':ask', response, response);
  },
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const pokeCenterHandlers = Alexa.CreateStateHandler(STATES.POKECENTERMODE, {
  [INTENTS.YES]: function (this: HandlerThis) {
    const { party, location } = this.attributes;
    this.attributes.lastVisitedCity = location;
    let response = helper.speakAsNurse(
      `Okay, I'll take your Pokemon for a few seconds. ${healSound} Thank you for waiting. We've restored your Pokemon to full health. ${seeYouAgainPokeCenter} <break />`,
    );
    response += pokeCenterNextLocation;
    helper.healTeam(party);

    this.emit(':ask', response, response);
  },
  [INTENTS.NO]: function (this: HandlerThis) {
    let response = helper.speakAsNurse(seeYouAgainPokeCenter);
    response += pokeCenterNextLocation;
    this.emit(':ask', response, response);
  },
  [INTENTS.HEAL]: function (this: HandlerThis) {
    const response = helper.speakAsNurse(welcomePokeCenter);
    this.emit(':ask', response, response);
  },
  [INTENTS.LEAVE]: function (this: HandlerThis) {
    const { location } = this.attributes;
    let response = helper.speakAsNurse(seeYouAgainPokeCenter);
    response += `<break /> You leave the Pokemon Center and now you're back in ${location.name}. `;
    response += helper.getLocationActivities(location);
    this.handler.state = STATES.CITYMODE;
    this.emit(':ask', response, response);
  },
  [INTENTS.BAG]: bagHandler,
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const pokeMartHandlers = Alexa.CreateStateHandler(STATES.POKEMARTMODE, {
  [INTENTS.MONEY]: function (this: HandlerThis) {
    const { money } = this.attributes;
    let response = `You have ${money} PokieDollars. `;
    if (money < 1000) {
      response += "Looks like you're running a little low! Don't think about shoplifting me, my Growlithe is watching you! ";
    } else if (money < 10000) {
      response += "Have I got a deal just for you! I'll let you have this swell Magikarp for just 500. What do you say? ... Well I don't give refunds! ";
    } else if (money < 50000) {
      response += "That's enough for a few Rage Candy Bars! Just 300 PokieDollars! Totally nothing suspicious about that! ";
    } else if (money < 100000) {
      response += "Jeez kid, did your mom give you all that allowance? What's in your wallet? ";
    } else {
      response += "Oh my Arceus! I don't think I've ever seen that much money! ";
    }
    response += "Come on, don't be such a slowpoke! What would you like to do next? Ask me what am I selling, tell me what you want to buy, or leave!";
    response = helper.speakAsMart(response);
    this.emit(':ask', response, response);
  },
  [INTENTS.ASK_ITEMS]: function (this: HandlerThis) {
    let response = 'You have the following items: ';
    const itemNames = Object.keys(ITEMS);
    for (let itemIndex = 0; itemIndex < itemNames.length - 1; itemIndex++) {
      response += `${itemNames[itemIndex]}s, `;
    }
    response += `and ${itemNames[itemNames.length - 1]}s. What would you like to buy?`;
    this.emit(':ask', response, response);
  },
  [INTENTS.BUY]: function (this: HandlerThis) {
    const item = String(this.event.request.intent.slots.Item.value).replace(/\s+/g, '').toLowerCase();
    this.attributes.chosenItem = ITEMS[item];
    const response = helper.speakAsMart(`You selected ${item}, which costs ${ITEMS[item].price} each. How many would you like to buy?`);

    this.emit(':ask', response, response);
  },
  [INTENTS.CHOOSE_NUM]: function (this: HandlerThis) {
    const num = Number(this.event.request.intent.slots.Number.value);
    const { money, chosenItem } = this.attributes;
    let response;

    if (chosenItem === null) {
      response = unchosenItem;
    } else {
      this.attributes.chosenItem = { ...chosenItem, count: num };

      response = `${num} ${chosenItem.name}`;
      response += num > 1 ? 's ' : ' ';
      response += `will cost you ${chosenItem.price * num} PokieDollars. `;
      if (chosenItem.price * num > money) {
        response += `${notEnoughMoney} Select a different amount or item`;
      } else {
        response += 'Say yes to confirm your order!';
      }
    }

    response = helper.speakAsMart(response);
    this.emit(':ask', response, response);
  },
  [INTENTS.YES]: function (this: HandlerThis) {
    const { chosenItem, money, location } = this.attributes;
    let response;
    if (chosenItem === null) {
      response = unchosenItem;
    } else if (money > chosenItem.price * chosenItem.count) {
      helper.buyItem(this.attributes);
      response = 'Thank you for your purchase! What would you like to do next? You can purchase a new item, or you can ask to leave';
    } else {
      response = `${notEnoughMoney} Get the hell out of here!`;
      response += helper.getLocationActivities(location);
      this.handler.state = location.type === 'CITY' ? STATES.CITYMODE : STATES.MOVEMENTMODE;
    }

    response = helper.speakAsMart(response);
    this.emit(':ask', response, response);
  },
  [INTENTS.LEAVE]: function (this: HandlerThis) {
    const { location } = this.attributes;
    let response = helper.speakAsMart(`Goodbye!`);
    response += `You leave the PokieMart and now you're back in ${location.name}. `;
    response += helper.getLocationActivities(location);
    this.handler.state = location.type === 'CITY' ? STATES.CITYMODE : STATES.MOVEMENTMODE;
    this.emit(':ask', response, response);
  },
  [INTENTS.BAG]: bagHandler,
  [INTENTS.NO]: function (this: HandlerThis) {
    const response = helper.speakAsMart(
      "Ok, I have canceled the order. You can ask me how much money you have, what items I have, or just tell me what you'd like to buy. Or you can get the hell outta here!",
    );
    this.attributes.chosenItem = null;
    this.emit(':ask', response, response);
  },
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const cityHandlers = Alexa.CreateStateHandler(STATES.CITYMODE, {
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
  [INTENTS.CHOOSE_LOC]: chooseLocationHandler,
  [INTENTS.BAG]: bagHandler,
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

const askQuestionHandlers = Alexa.CreateStateHandler(STATES.ASKMODE, {
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});

// Called when the session starts.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = (event, context, _callback) => {
  const alexa = Alexa.handler(event, context);
  // alexa.dynamoDBTableName = 'RouteOneTable';
  alexa.registerHandlers(
    newSessionHandler,
    startGameHandlers,
    askNameHandlers,
    askRivalHandlers,
    askMovementHandlers,
    askLocationHandlers,
    askPokemonHandlers,
    battleHandlers,
    chooseMoveHandlers,
    switchPokeHandlers,
    bagHandlers,
    whiteOutHandlers,
    pokeCenterHandlers,
    pokeMartHandlers,
    cityHandlers,
    askQuestionHandlers,
  );
  alexa.execute();
};
