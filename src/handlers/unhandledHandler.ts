import { unhandledGeneral } from '../constants/messages';
import { HandlerThis } from './HandlerThis';

export function unhandledHandler(this: HandlerThis) {
  this.emit(':ask', unhandledGeneral, unhandledGeneral);
}
