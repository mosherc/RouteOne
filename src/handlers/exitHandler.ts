import { HandlerThis } from './HandlerThis';

export function exitHandler(this: HandlerThis) {
  this.emit(':tell', this.attributes.goodbyeMessage);
}
