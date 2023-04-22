import { helpBattle } from '../constants/messages';
import { STATES } from '../constants/states';
import { helper } from '../helper';
import { HandlerThis } from './HandlerThis';

export function trainHandler(this: HandlerThis) {
  let response;
  const { location, party } = this.attributes;
  if (location.type !== 'ROUTE') {
    response = "You can't train here! Say continue to move to a new location.";
    this.emit(':ask', response, response);
    return;
  }
  if (this.attributes.movementState < 2) {
    response = "You don't have any Pokemon to train! Say continue instead.";
    this.emit(':ask', response, response);
  }

  const locations = this.handler.state === STATES.MOVEMENTMODE ? 'a new location' : location.adjacentLocations.join(', ');

  const randAction = helper.randomAction(location);
  if (randAction === 'trainer') {
    this.attributes.battle = 'trainer'; // can also be "trainer" for trainer battle, or "wild" for wild battle
    const OT = helper.generateOT();
    this.attributes.opponentName = OT;
    this.attributes.opponentParty = helper.generateParty(OT, party);
    this.handler.state = STATES.BATTLEMODE;
    const dialogue = helper.getRandomBattleDialogue(OT);
    this.attributes.opponentVoice = dialogue.voice;
    response = helper.speakWithVoice(dialogue.accostment, dialogue.voice);
  } else if (randAction === 'wild') {
    const pokemon = location.type === 'ROUTE' ? helper.generateRandomPoke(location, party) : null;
    if (!pokemon) {
      throw new Error('Unable to generate pokemon.');
    }
    this.attributes.battle = 'wild'; // can also be "trainer" for trainer battle, or "wild" for wild battle
    this.attributes.opponentName = 'wild';
    this.attributes.opponentParty = [pokemon];
    this.handler.state = STATES.BATTLEMODE;
    response = `Wild ${pokemon.name} appeared! Say fight to battle! ${helpBattle}`;
  } else if (randAction === 'item') {
    // get item
    const findableItems = location.items;
    const foundItem = findableItems[helper.generateRandomInt(0, findableItems.length - 1)];
    this.attributes.bag[foundItem].count++;
    response = `You found a ${foundItem}! You put it in your bag for safekeeping. Would you like to go to ${locations}? Or you can say train to stay here and train. `;
  } else {
    response = `You didn't find any pokemon! Say train to keep training, or continue to ${locations}.`;
  }
  this.emit(':ask', response, response);
}
