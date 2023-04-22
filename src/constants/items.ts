import { MoveStatus } from './move-set';

type CommonItem = {
  name: string;
  count: number;
  price: number;
};

type HealingItem = {
  type: 'HEALING';
  hp: number;
} & CommonItem;

type RestoreItem = {
  type: 'RESTORE';
  status: MoveStatus;
  hp: number;
} & CommonItem;

type BallItem = {
  type: 'BALL';
  catchRate: number;
} & CommonItem;

export type Item = HealingItem | RestoreItem | BallItem;

export const AVAILABLE_ITEMS = [
  'POTION',
  'SUPER_POTION',
  'HYPER_POTION',
  'MAX_POTION',
  'FULL_RESTORE',
  'FULL_HEAL',
  'POKEBALL',
  'GREAT_BALL',
  'ULTRA_BALL',
  'MASTER_BALL',
] as const;
export type AvailableItems = (typeof AVAILABLE_ITEMS)[number];

export const ITEMS: Record<AvailableItems, Item> = {
  POTION: {
    name: 'potion',
    count: 0,
    price: 200,
    type: 'HEALING',
    hp: 20,
  },
  SUPER_POTION: {
    name: 'superpotion',
    count: 0,
    price: 700,
    type: 'HEALING',
    hp: 50,
  },
  HYPER_POTION: {
    name: 'hyperpotion',
    count: 0,
    price: 1500,
    type: 'HEALING',
    hp: 200,
  },
  MAX_POTION: {
    name: 'maxpotion',
    count: 0,
    price: 2500,
    type: 'HEALING',
    hp: 9999999,
  },
  FULL_RESTORE: {
    name: 'fullrestore',
    count: 0,
    price: 3000,
    type: 'RESTORE',
    hp: 999999,
    status: 'ALL',
  },
  FULL_HEAL: {
    name: 'fullheal',
    count: 0,
    price: 600,
    type: 'RESTORE',
    hp: 0,
    status: 'ALL',
  },
  POKEBALL: {
    name: 'pokéball',
    count: 0,
    price: 200,
    type: 'BALL',
    catchRate: 1,
  },
  GREAT_BALL: {
    name: 'greatball',
    count: 0,
    price: 600,
    type: 'BALL',
    catchRate: 1.5,
  },
  ULTRA_BALL: {
    name: 'ultraball',
    count: 0,
    price: 1200,
    type: 'BALL',
    catchRate: 2,
  },
  MASTER_BALL: {
    name: 'masterball',
    count: 0,
    price: 999999,
    type: 'BALL',
    catchRate: 255,
  },
};
