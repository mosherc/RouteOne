/**
 * This skill is a Pokemon adventure game built with the Amazon Alexa Skills Kit.
 */
import Alexa from 'alexa-sdk';
import {
  startGameHandlers,
  askNameHandlers,
  askRivalHandlers,
  askMovementHandlers,
  askLocationHandlers,
  askPokemonHandlers,
  battleHandlers,
  chooseMoveHandlers,
  switchPokeHandlers,
  bagHandlers,
  whiteOutHandlers,
  pokeCenterHandlers,
  pokeMartHandlers,
  cityHandlers,
  askQuestionHandlers,
  newSessionHandler,
} from './modes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = (event, context, _callback) => {
  const alexa = Alexa.handler(event, context);
  // alexa.dynamoDBTableName = 'RouteOneTable';
  alexa.registerHandlers(
    newSessionHandler,
    startGameHandlers,
    askNameHandlers,
    askRivalHandlers,
    askMovementHandlers,
    askLocationHandlers,
    askPokemonHandlers,
    battleHandlers,
    chooseMoveHandlers,
    switchPokeHandlers,
    bagHandlers,
    whiteOutHandlers,
    pokeCenterHandlers,
    pokeMartHandlers,
    cityHandlers,
    askQuestionHandlers,
  );
  alexa.execute();
};
