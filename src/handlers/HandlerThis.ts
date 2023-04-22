import { ITEMS, Item } from '../constants/items';
import { AvailablePokemon, Pokemon } from '../constants/pokemon';
import { STATES } from '../constants/states';
import { Location } from '../constants/locations';
import { VoiceName } from '../constants/trainers';

export type Sex = 'boy' | 'girl';
export type HandlerThis = {
  attributes: {
    bag: typeof ITEMS;
    battle: 'first' | 'wild' | 'trainer' | 'gym' | null;
    chosenItem: Item | null;
    goodbyeMessage: string;
    isOakJapanese: boolean;
    lastVisitedCity: Location;
    location: Location;
    money: number;
    movementState: number;
    opponentName: string | undefined;
    opponentParty: Pokemon[] | undefined;
    opponentVoice: VoiceName;
    party: Pokemon[];
    playerName: string;
    prevState: (typeof STATES)[keyof typeof STATES] | null;
    rivalName: string;
    rivalPronouns: {
      possessive: 'his' | 'her';
      subject: 'he' | 'she';
      object: 'him' | 'her';
      child: 'son' | 'daughter';
      grandChild: 'grandson' | 'granddaughter';
    };
    rivalSex: Sex;
    sex: Sex;
    starter: AvailablePokemon | undefined;
  };
  event: {
    request: {
      intent: {
        slots: {
          Sex: {
            value: string;
          };
          Name: {
            value: string;
          };
          Pokemon: {
            value: string;
          };
          Move: {
            value: string;
          };
          Item: {
            value: string;
          };
          Location: {
            value: string;
          };
          Number: {
            value: string;
          };
        };
      };
    };
  };
  handler: {
    state: (typeof STATES)[keyof typeof STATES] | null;
  };
  emit: (event: string, ...args: any[]) => void;
};
