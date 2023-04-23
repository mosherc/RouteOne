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
    this.attributes.prevState = this.handler.state;
    this.handler.state = STATES.BAGMODE;
    response = helper.modeAvailableActions(this.attributes, this.handler.state);
    // go to bag mode maybe
    this.emit(':ask', response, response);
  }
}
