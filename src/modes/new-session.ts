import { INTENTS } from "../constants/intents";
import { ITEMS } from "../constants/items";
import { LOCATIONS } from "../constants/locations";
import { goodbyeMessage, welcomeMessage, unhandledSex, helpMessage, repeatChooseSex } from "../constants/messages";
import { STATES } from "../constants/states";
import { HandlerThis } from "../handlers";
import { helper } from "../helper";

export const newSessionHandler = {
  [INTENTS.LAUNCH]: function (this: HandlerThis) {
    this.handler.state = STATES.STARTMODE;
    this.attributes.goodbyeMessage = goodbyeMessage;
    this.attributes.storyProgression = 0;
    this.attributes.money = 0;
    this.attributes.bag = ITEMS;
    this.attributes.party = [];
    this.attributes.chosenItem = null;
    this.attributes.location = LOCATIONS.PALLET_TOWN;
    this.attributes.lastVisitedCity = LOCATIONS.PALLET_TOWN;
    const isOakJapanese = helper.generateRandomInt(0, 100) < 25;
    this.attributes.isOakJapanese = isOakJapanese;
    // determine oak's race
    this.emit(':ask', helper.speakAsOak(welcomeMessage, isOakJapanese), helper.speakAsOak(unhandledSex, isOakJapanese));
  },
  [INTENTS.HELP]: function (this: HandlerThis) {
    this.handler.state = STATES.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  [INTENTS.UNHANDLED]: function (this: HandlerThis) {
    this.handler.state = STATES.STARTMODE;
    const { isOakJapanese } = this.attributes;
    this.emit(':ask', helper.speakAsOak(unhandledSex, isOakJapanese), helper.speakAsOak(repeatChooseSex, isOakJapanese));
  },
};