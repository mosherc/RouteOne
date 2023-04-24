import { CreateStateHandler } from "alexa-sdk";
import { INTENTS } from "../constants/intents";
import { ITEMS } from "../constants/items";
import { unchosenItem, notEnoughMoney } from "../constants/messages";
import { STATES } from "../constants/states";
import { HandlerThis, bagHandler, unhandledHandler, exitHandler, startOverHandler, bicycleHandler, checkPokeHandler } from "../handlers";
import { helper } from "../helper";

export const pokeMartHandlers = CreateStateHandler(STATES.POKEMARTMODE, {
  [INTENTS.MONEY]: function (this: HandlerThis) {
    const { money } = this.attributes;
    let response = `You have ${money} PokieDollars. `;
    if (money < 1000) {
      response += "Looks like you're running a little low! Don't think about shoplifting me, my Growlithe is watching you! ";
    } else if (money < 10000) {
      response += "Have I got a deal just for you! I'll let you have this swell Magikarp for just 500. What do you say? ... Well I don't give refunds! ";
    } else if (money < 50000) {
      response += "That's enough for a few Rage Candy Bars! Just 300 PokieDollars! Totally nothing suspicious about that! ";
    } else if (money < 100000) {
      response += "Jeez kid, did your mom give you all that allowance? What's in your wallet? ";
    } else {
      response += "Oh my Arceus! I don't think I've ever seen that much money! ";
    }
    response += "Come on, don't be such a slowpoke! What would you like to do next? Ask me what am I selling, tell me what you want to buy, or leave!";
    response = helper.speakAsMart(response);
    this.emit(':ask', response, response);
  },
  [INTENTS.ASK_ITEMS]: function (this: HandlerThis) {
    let response = 'You have the following items: ';
    const itemNames = Object.keys(ITEMS);
    for (let itemIndex = 0; itemIndex < itemNames.length - 1; itemIndex++) {
      response += `${itemNames[itemIndex]}s, `;
    }
    response += `and ${itemNames[itemNames.length - 1]}s. What would you like to buy?`;
    this.emit(':ask', response, response);
  },
  [INTENTS.BUY]: function (this: HandlerThis) {
    const item = String(this.event.request.intent.slots.Item.value).replace(/\s+/g, '').toLowerCase();
    this.attributes.chosenItem = ITEMS[item];
    const response = helper.speakAsMart(`You selected ${item}, which costs ${ITEMS[item].price} each. How many would you like to buy?`);

    this.emit(':ask', response, response);
  },
  [INTENTS.CHOOSE_NUM]: function (this: HandlerThis) {
    const num = Number(this.event.request.intent.slots.Number.value);
    const { money, chosenItem } = this.attributes;
    let response;

    if (chosenItem === null) {
      response = unchosenItem;
    } else {
      this.attributes.chosenItem = { ...chosenItem, count: num };

      response = `${num} ${chosenItem.name}`;
      response += num > 1 ? 's ' : ' ';
      response += `will cost you ${chosenItem.price * num} PokieDollars. `;
      if (chosenItem.price * num > money) {
        response += `${notEnoughMoney} Select a different amount or item`;
      } else {
        response += 'Say yes to confirm your order!';
      }
    }

    response = helper.speakAsMart(response);
    this.emit(':ask', response, response);
  },
  [INTENTS.YES]: function (this: HandlerThis) {
    const { chosenItem, money, location } = this.attributes;
    let response;
    if (chosenItem === null) {
      response = unchosenItem;
    } else if (money > chosenItem.price * chosenItem.count) {
      helper.buyItem(this.attributes);
      response = 'Thank you for your purchase! What would you like to do next? You can purchase a new item, or you can ask to leave';
    } else {
      response = `${notEnoughMoney} Get the hell out of here!`;
      response += helper.getLocationActivities(location);
      this.handler.state = location.type === 'CITY' ? STATES.CITYMODE : STATES.MOVEMENTMODE;
    }

    response = helper.speakAsMart(response);
    this.emit(':ask', response, response);
  },
  [INTENTS.LEAVE]: function (this: HandlerThis) {
    const { location } = this.attributes;
    let response = helper.speakAsMart(`Goodbye!`);
    response += `You leave the PokieMart and now you're back in ${location.name}. `;
    response += helper.getLocationActivities(location);
    this.handler.state = location.type === 'CITY' ? STATES.CITYMODE : STATES.MOVEMENTMODE;
    this.emit(':ask', response, response);
  },
  [INTENTS.BAG]: bagHandler,
  [INTENTS.NO]: function (this: HandlerThis) {
    const response = helper.speakAsMart(
      "Ok, I have canceled the order. You can ask me how much money you have, what items I have, or just tell me what you'd like to buy. Or you can get the hell outta here!",
    );
    this.attributes.chosenItem = null;
    this.emit(':ask', response, response);
  },
  [INTENTS.CHECK_POKE]: checkPokeHandler,
  [INTENTS.HELP]: unhandledHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: startOverHandler,
  [INTENTS.BIKE]: bicycleHandler,
  [INTENTS.UNHANDLED]: unhandledHandler,
});