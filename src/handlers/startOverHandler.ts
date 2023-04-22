import { STATES } from '../constants/states';
import { HandlerThis } from './HandlerThis';
import { welcomeMessage } from '../constants/messages';

export function startOverHandler(this: HandlerThis) {
  // reset the game state to start mode
  this.handler.state = STATES.STARTMODE;
  this.emit(':ask', welcomeMessage, welcomeMessage);
}
