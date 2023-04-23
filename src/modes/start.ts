import { CreateStateHandler } from "ask-sdk-v1adapter";
import { INTENTS } from "../constants/intents";
import { unhandledSex } from "../constants/messages";
import { STATES } from "../constants/states";
import { HandlerThis, Sex, exitHandler, helpSexHandler } from "../handlers";
import { helper } from "../helper";

export const startGameHandlers = CreateStateHandler(STATES.STARTMODE, {
  [INTENTS.SKIP]: function (this: HandlerThis) {
    this.handler.state = STATES.CHOOSEPOKEMONMODE;
    this.attributes.playerName = 'Red';
    this.attributes.sex = 'boy';
    this.attributes.rivalName = 'Blue';
    this.attributes.rivalSex = 'boy';
    this.attributes.rivalPronouns = helper.getPronouns('boy');
    this.attributes.storyProgression = 2;
    let response = helper.speakAsOak("A little impatient, are we? Anyway, Do you choose Bulbasaur, the grass Pokemon, Charmander, the fire Pokemon, or Squirtle, the water Pokemon?", this.attributes.isOakJapanese);
    this.emit(':ask', response, response);
  },
  [INTENTS.SEX]: function (this: HandlerThis) {
    this.attributes.sex = this.event.request.intent.slots.Sex.value as Sex;
    const response = helper.speakAsOak("Let's begin with your name. What is it?", this.attributes.isOakJapanese);
    // set state to asking name
    this.handler.state = STATES.NAMEMODE;

    // ask the next question
    this.emit(':ask', response, response);
  },
  [INTENTS.NO]: exitHandler,
  [INTENTS.STOP]: exitHandler,
  [INTENTS.CANCEL]: exitHandler,
  [INTENTS.START_OVER]: helpSexHandler,
  [INTENTS.HELP]: helpSexHandler,
  [INTENTS.UNHANDLED]: function (this: HandlerThis) {
    const response = helper.speakAsOak(unhandledSex, this.attributes.isOakJapanese);
    this.emit(':ask', response, response);
  },
});