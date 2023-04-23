import { CreateStateHandler } from "ask-sdk-v1adapter";
import { INTENTS } from "../constants/intents";
import { helpBattle, helpMovement } from "../constants/messages";
import { STATES } from "../constants/states";
import { HandlerThis, bagHandler, trainHandler, exitHandler, startOverHandler, bicycleHandler, unhandledHandler, checkPokeHandler } from "../handlers";
import { helper } from "../helper";

export const askMovementHandlers = CreateStateHandler(STATES.MOVEMENTMODE, {
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
  [INTENTS.CHECK_POKE]: checkPokeHandler,
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