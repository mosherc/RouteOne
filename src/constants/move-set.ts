import { DamageModifiers } from './damage-modifiers';
import { PokemonType } from './type-chart';

export type MoveCategory = 'PHYSICAL' | 'SPECIAL' | 'STATUS';
export type MoveStatus = 'PARALYZE' | 'BURN' | 'FREEZE' | 'POISON' | 'SLEEP' | 'ALL';
type StatusChance = 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 100;
type StatusEffect = {
  status: MoveStatus;
  chance: StatusChance;
  numberOfMoves?: [number, number];
};
export type ModifierName = 'atk' | 'def' | 'spatk' | 'spdef' | 'hp' | 'acc' | 'speed';
export type StatName = Exclude<ModifierName, 'acc'>;
export type ModifierValues = Record<ModifierName, DamageModifiers>;

export type Move = {
  name: string;
  type: PokemonType;
  category: MoveCategory;
  power: number;
  accuracy: number;
  pp: number;
  statusEffect?: StatusEffect[];
  modifier?: {
    self: boolean;
    values: ModifierValues;
  };
};

export const MOVES = [
  'GROWL',
  'TACKLE',
  'SCRATCH',
  'TAIL_WHIP',
  'THUNDER_SHOCK',
  'LEECH_SEED',
  'VINE_WHIP',
  'POISON_POWDER',
  'SLEEP_POWDER',
  'GROWTH',
  'RAZOR_LEAF',
  'SOLAR_BEAM',
] as const;

export type AvailableMoves = (typeof MOVES)[number];

export type MoveSet = Record<AvailableMoves, Move>;

export const MOVE_SET: MoveSet = {
  GROWL: {
    name: 'growl',
    type: 'NORMAL',
    category: 'STATUS',
    power: 0,
    accuracy: 100,
    pp: 40,
    modifier: {
      self: true,
      values: { atk: 1, def: 0, spatk: 0, spdef: 0, hp: 0, acc: 0, speed: 0 },
    },
  },
  TACKLE: {
    name: 'tackle',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 35,
  },
  SCRATCH: {
    name: 'scratch',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 35,
  },
  TAIL_WHIP: {
    name: 'tailwhip',
    type: 'NORMAL',
    category: 'STATUS',
    power: 0,
    accuracy: 100,
    pp: 30,
    modifier: {
      self: false,
      values: { def: -1, atk: 0, spatk: 0, spdef: 0, hp: 0, acc: 0, speed: 0 },
    },
  },
  THUNDER_SHOCK: {
    name: 'thundershock',
    type: 'ELECTRIC',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 30,
  },
  LEECH_SEED: {
    name: 'leechseed',
    type: 'GRASS',
    category: 'STATUS',
    power: 0,
    accuracy: 90,
    pp: 10,
    // not implemented yet
    modifier: {
      self: false,
      values: { hp: 1, atk: 0, spatk: 0, spdef: 0, def: 0, acc: 0, speed: 0 },
    },
  },
  VINE_WHIP: {
    name: 'vinewhip',
    type: 'GRASS',
    category: 'PHYSICAL',
    power: 35,
    accuracy: 100,
    pp: 10,
  },
  POISON_POWDER: {
    name: 'poisonpowder',
    type: 'POISON',
    category: 'STATUS',
    statusEffect: [
      {
        status: 'POISON',
        chance: 75,
      },
    ],
    power: 0,
    accuracy: 75,
    pp: 35,
  },
  SLEEP_POWDER: {
    name: 'sleeppowder',
    type: 'GRASS',
    power: 0,
    accuracy: 75,
    category: 'STATUS',
    statusEffect: [
      {
        status: 'SLEEP',
        chance: 75,
      },
    ],
    pp: 15,
  },
  GROWTH: {
    name: 'growth',
    type: 'NORMAL',
    category: 'STATUS',
    accuracy: 100,
    power: 0,
    pp: 20,
    modifier: {
      self: true,
      values: { spatk: 1, atk: 0, def: 0, spdef: 0, hp: 0, acc: 0, speed: 0 },
    },
  },
  RAZOR_LEAF: {
    name: 'razorleaf',
    type: 'GRASS',
    category: 'STATUS',
    accuracy: 95,
    pp: 25,
    power: 55,
  },
  SOLAR_BEAM: {
    name: 'solarbeam',
    type: 'GRASS',
    category: 'SPECIAL',
    accuracy: 100,
    power: 120,
    pp: 10,
  },
};
