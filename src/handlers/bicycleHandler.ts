import { helper } from '../helper';
import { HandlerThis } from './HandlerThis';

export function bicycleHandler(this: HandlerThis) {
  const { isOakJapanese } = this.attributes;
  let response = "Oak's words echoed...";
  response += helper.speakAsOak("There's a time and place for everything, but not now.", isOakJapanese);
  this.emit(':ask', response);
}
