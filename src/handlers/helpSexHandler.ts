import { helpChooseSex } from '../constants/messages';
import { helper } from '../helper';
import { HandlerThis } from './HandlerThis';

export function helpSexHandler(this: HandlerThis) {
  const response = helper.speakAsOak(helpChooseSex, this.attributes.isOakJapanese);
  this.emit(':ask', response, response);
}
