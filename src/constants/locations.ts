import { AvailableItems } from './items';
import { AvailablePokemon } from './pokemon';

export const LOCATIONS_LIST = ['PALLET_TOWN', 'ROUTE_1', 'VIRIDIAN_FOREST', 'VIRIDIAN_CITY'] as const;
export type AvailableLocations = (typeof LOCATIONS_LIST)[number];

export const BUILDINGS = ['POKEMART', 'POKECENTER', 'GYM'] as const;
export type AvailableBuildings = (typeof BUILDINGS)[number];

type CommonLocation = {
  name: string;
  buildings: AvailableBuildings[];
  gym: boolean; // make this a gym type
  adjacentLocations: AvailableLocations[];
  items: AvailableItems[];
};
export type City = CommonLocation & {
  type: 'CITY';
};

export type Route = CommonLocation & {
  type: 'ROUTE';
  pokemon: Partial<Record<AvailablePokemon, number>>;
  trainers: number;
  grass: number;
  items: AvailableItems[];
};

export type Location = City | Route;

export const LOCATIONS: Record<AvailableLocations, Location> = {
  PALLET_TOWN: {
    name: 'pallet town',
    buildings: [],
    items: [],
    type: 'CITY',
    adjacentLocations: ['ROUTE_1'],
    gym: false,
  },
  'ROUTE_1': {
    name: 'route 1',
    buildings: [],
    gym: false,
    pokemon: {
      PIDGEY: 50,
      RATTATA: 50,
    },
    trainers: 10,
    grass: 60,
    items: ['POTION', 'POKEBALL'],
    type: 'ROUTE',
    adjacentLocations: ['VIRIDIAN_FOREST', 'PALLET_TOWN'],
  },
  VIRIDIAN_FOREST: {
    name: 'viridian forest',
    buildings: [],
    gym: false,
    pokemon: {
      // caterpie: 40,
      // weedle: 40,
      // kakuna: 7.5,
      // metapod: 7.5,
      PIKACHU: 5,
    },
    trainers: 30,
    grass: 85,
    items: ['POTION', 'POKEBALL', 'FULL_HEAL'],
    type: 'ROUTE',
    adjacentLocations: ['VIRIDIAN_CITY'],
  },
  VIRIDIAN_CITY: {
    name: 'viridian city',
    buildings: ['POKEMART', 'POKECENTER', 'GYM'],
    items: [],
    type: 'CITY',
    gym: true,
    adjacentLocations: [],
  },
};
