import { helper } from '../helper';
import { HandlerThis } from './HandlerThis';
import { STATES } from '../constants/states';

export function bagHandler(this: HandlerThis) {
  const { bag } = this.attributes;
  let response = '';
  const empty = helper.checkBagEmpty(bag);
  if (empty) {
    response = 'Your bag is empty! Choose another action.';
    this.emit(':ask', response, response);
  } else {
    const items = Object.values(bag)
      .map((item) => item.name)
      .join(', ');
    response = `What would you like to use in your bag? You have the following items: ${items}`;
    response += ". Say it in the form of 'use item on pokemon'.";
    // go to bag mode maybe
    this.attributes.prevState = this.handler.state;
    this.handler.state = STATES.BAGMODE;
    this.emit(':ask', response, response);
  }
}
