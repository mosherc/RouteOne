import { CreateStateHandler } from "alexa-sdk";
import { pokemonCaughtSound, rivalBattleSound } from "../constants/audio";
import { INTENTS } from "../constants/intents";
import { unhandledPokemon, helpChoosePokemon } from "../constants/messages";
import { AvailablePokemon } from "../constants/pokemon";
import { STATES } from "../constants/states";
import { HandlerThis, exitHandler, startOverHandler, bicycleHandler } from "../handlers";
import { helper } from "../helper";

export const askPokemonHandlers = CreateStateHandler(STATES.CHOOSEPOKEMONMODE, {
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