import { helpName } from '../constants/messages';
import { HandlerThis } from './HandlerThis';

export function helpNameHandler(this: HandlerThis) {
  this.emit(':ask', helpName, helpName);
}
