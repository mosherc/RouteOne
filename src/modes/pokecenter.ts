import { CreateStateHandler } from "ask-sdk-v1adapter";
import { healSound } from "../constants/audio";
import { INTENTS } from "../constants/intents";
import { seeYouAgainPokeCenter, pokeCenterNextLocation, welcomePokeCenter } from "../constants/messages";
import { STATES } from "../constants/states";
import { HandlerThis, bagHandler, unhandledHandler, exitHandler, startOverHandler, bicycleHandler, checkPokeHandler } from "../handlers";
import { helper } from "../helper";

export const pokeCenterHandlers = CreateStateHandler(STATES.POKECENTERMODE, {
  [INTENTS.YES]: function (this: HandlerThis) {
    const { party, location } = this.attributes;
    this.attributes.lastVisitedCity = location;
    let response = helper.speakAsNurse(
      `Okay, I'll take your Pokemon for a few seconds. ${healSound} Thank you for waiting. We've restored your Pokemon to full health. ${seeYouAgainPokeCenter} <break />`,
    );
    response += pokeCenterNextLocation;
    helper.healTeam(party);

    this.emit(':ask', response, response);
  },
  [INTENTS.NO]: function (this: HandlerThis) {
    let response = helper.speakAsNurse(seeYouAgainPokeCenter);
    response += pokeCenterNextLocation;
    this.emit(':ask', response, response);
  },
  [INTENTS.HEAL]: function (this: HandlerThis) {
    const response = helper.speakAsNurse(welcomePokeCenter);
    this.emit(':ask', response, response);
  },
  [INTENTS.LEAVE]: function (this: HandlerThis) {
    const { location } = this.attributes;
    let response = helper.speakAsNurse(seeYouAgainPokeCenter);
    response += `<break /> You leave the Pokemon Center and now you're back in ${location.name}. `;
    response += helper.getLocationActivities(location);
    this.handler.state = STATES.CITYMODE;
    this.emit(':ask', response, response);
  },
  [INTENTS.CHECK_POKE]: checkPokeHandler,
  [INTENTS.BAG]: bagHandler,
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});