import { MOVE_SET, StatName, ModifierValues, Move, MoveStatus } from './move-set';
import { PokemonType } from './type-chart';

// an array of all 151 pokemon names in all caps
export const AVAILABLE_POKEMON = [
  'BULBASAUR',
  'IVYSAUR',
  'VENUSAUR',
  'CHARMANDER',
  'CHARMELEON',
  'CHARIZARD',
  'SQUIRTLE',
  'WARTORTLE',
  'BLASTOISE',
  // "CATERPIE",
  // "METAPOD",
  // "BUTTERFREE",
  // "WEEDLE",
  // "KAKUNA",
  // "BEEDRILL",
  'PIDGEY',
  // "PIDGEOTTO",
  // "PIDGEOT",
  'RATTATA',
  // "RATICATE",
  // "SPEAROW",
  // "FEAROW",
  // "EKANS",
  // "ARBOK",
  'PIKACHU',
  // "RAICHU",
  // "SANDSHREW",
  // "SANDSLASH",
  // "NIDORAN_FEMALE",
  // "NIDORINA",
  // "NIDOQUEEN",
  // "NIDORAN_MALE",
  // "NIDORINO",
  // "NIDOKING",
  // "CLEFAIRY",
  // "CLEFABLE",
  // "VULPIX",
  // "NINETALES",
  // "JIGGLYPUFF",
  // "WIGGLYTUFF",
  // "ZUBAT",
  // "GOLBAT",
  // "ODDISH",
  // "GLOOM",
  // "VILEPLUME",
  // "PARAS",
  // "PARASECT",
  // "VENONAT",
  // "VENOMOTH",
  // "DIGLETT",
  // "DUGTRIO",
  // "MEOWTH",
  // "PERSIAN",
  // "PSYDUCK",
  // "GOLDUCK",
  // "MANKEY",
  // "PRIMEAPE",
  // "GROWLITHE",
  // "ARCANINE",
  // "POLIWAG",
  // "POLIWHIRL",
  // "POLIWRATH",
  // "ABRA",
  // "KADABRA",
  // "ALAKAZAM",
  // "MACHOP",
  // "MACHOKE",
  // "MACHAMP",
  // "BELLSPROUT",
  // "WEEPINBELL",
  // "VICTREEBEL",
  // "TENTACOOL",
  // "TENTACRUEL",
  // "GEODUDE",
  // "GRAVELER",
  // "GOLEM",
  // "PONYTA",
  // "RAPIDASH",
  // "SLOWPOKE",
  // "SLOWBRO",
  // "MAGNEMITE",
  // "MAGNETON",
  // "FARFETCH'D",
  // "DODUO",
  // "DODRIO",
  // "SEEL",
  // "DEWGONG",
  // "GRIMER",
  // "MUK",
  // "SHELLDER",
  // "CLOYSTER",
  // "GASTLY",
  // "HAUNTER",
  // "GENGAR",
  // "ONIX",
  // "DROWZEE",
  // "HYPNO",
  // "KRABBY",
  // "KINGLER",
  // "VOLTORB",
  // "ELECTRODE",
  // "EXEGGCUTE",
  // "EXEGGUTOR",
  // "CUBONE",
  // "MAROWAK",
  // "HITMONLEE",
  // "HITMONCHAN",
  // "LICKITUNG",
  // "KOFFING",
  // "WEEZING",
  // "RHYHORN",
  // "RHYDON",
  // "CHANSEY",
  // "TANGELA",
  // "KANGASKHAN",
  // "HORSEA",
  // "SEADRA",
  // "GOLDEEN",
  // "SEAKING",
  // "STARYU",
  // "STARMIE",
  // "MR_MIME",
  // "SCYTHER",
  // "JYNX",
  // "ELECTABUZZ",
  // "MAGMAR",
  // "PINSIR",
  // "TAUROS",
  // "MAGIKARP",
  // "GYARADOS",
  // "LAPRAS",
  // "DITTO",
  'EEVEE',
  // "VAPOREON",
  // "JOLTEON",
  // "FLAREON",
  // "PORYGON",
  // "OMANYTE",
  // "OMASTAR",
  // "KABUTO",
  // "KABUTOPS",
  // "AERODACTYL",
  // "SNORLAX",
  // "ARTICUNO",
  // "ZAPDOS",
  // "MOLTRES",
  // "DRATINI",
  // "DRAGONAIR",
  // "DRAGONITE",
  // "MEWTWO",
  // "MEW",
] as const;

export type AvailablePokemon = (typeof AVAILABLE_POKEMON)[number];
export type StatValues = Record<StatName, number>;

export type PokedexEntry = {
  name: string;
  id: number;
  base: {
    hp: number;
    atk: number;
    def: number;
    spatk: number;
    spdef: number;
    speed: number;
  };
  baseExp: number;
  types: [PokemonType] | [PokemonType, PokemonType];
  learnSet: Record<number, Move>;
  catchRate: number;
  evolves?: {
    level: number;
    into: AvailablePokemon;
  };
};

export type Pokemon = PokedexEntry & {
  modifiers: ModifierValues;
  stats: StatValues;
  individualValues: StatValues;
  effortValues: StatValues;
  level: number;
  experience: number;
  OT: string;
  status: Exclude<MoveStatus, 'ALL'> | null;
  moveSet: Move[]; // [] | [Move] | [Move, Move] | [Move, Move, Move] | [Move, Move, Move, Move];
};

// Pokemon constants only
export const POKEDEX: Record<AvailablePokemon, PokedexEntry> = {
  BULBASAUR: {
    name: 'bulbasaur',
    id: 1,
    base: {
      hp: 45,
      atk: 49,
      def: 49,
      spatk: 65,
      spdef: 65,
      speed: 45,
    },
    baseExp: 64,
    types: ['GRASS', 'POISON'],
    learnSet: {
      1: MOVE_SET.TACKLE,
      3: MOVE_SET.GROWL,
      7: MOVE_SET.LEECH_SEED,
      13: MOVE_SET.VINE_WHIP,
      20: MOVE_SET.POISON_POWDER,
      27: MOVE_SET.RAZOR_LEAF,
      34: MOVE_SET.GROWTH,
      41: MOVE_SET.SLEEP_POWDER,
      48: MOVE_SET.SOLAR_BEAM,
    },
    catchRate: 45,
    evolves: {
      level: 16,
      into: 'IVYSAUR',
    },
  },
  IVYSAUR: {
    name: 'ivysaur',
    id: 2,
    base: {
      hp: 60,
      atk: 62,
      def: 63,
      spatk: 80,
      spdef: 80,
      speed: 60,
    },
    baseExp: 142,
    types: ['GRASS', 'POISON'],
    learnSet: {
      1: MOVE_SET.TACKLE,
      3: MOVE_SET.GROWL,
      7: MOVE_SET.LEECH_SEED,
      13: MOVE_SET.VINE_WHIP,
      22: MOVE_SET.POISON_POWDER,
      30: MOVE_SET.RAZOR_LEAF,
      38: MOVE_SET.GROWTH,
      46: MOVE_SET.SLEEP_POWDER,
      54: MOVE_SET.SOLAR_BEAM,
    },
    catchRate: 45,
    evolves: {
      level: 32,
      into: 'VENUSAUR',
    },
  },
  VENUSAUR: {
    name: 'venusaur',
    id: 3,
    base: {
      hp: 80,
      atk: 82,
      def: 83,
      spatk: 100,
      spdef: 100,
      speed: 80,
    },
    baseExp: 236,
    types: ['GRASS', 'POISON'],
    learnSet: {
      1: MOVE_SET.TACKLE,
      3: MOVE_SET.GROWL,
      7: MOVE_SET.LEECH_SEED,
      13: MOVE_SET.VINE_WHIP,
      22: MOVE_SET.POISON_POWDER,
      30: MOVE_SET.RAZOR_LEAF,
      43: MOVE_SET.GROWTH,
      55: MOVE_SET.SLEEP_POWDER,
      65: MOVE_SET.SOLAR_BEAM,
    },
    catchRate: 45,
  },
  CHARMANDER: {
    name: 'charmander',
    id: 4,
    base: {
      hp: 39,
      atk: 52,
      def: 43,
      spatk: 60,
      spdef: 50,
      speed: 65,
    },
    baseExp: 62,
    types: ['FIRE'],
    catchRate: 45,
    learnSet: {
      1: MOVE_SET.TACKLE,
      2: MOVE_SET.SCRATCH,
    },
  },
  CHARMELEON: {
    name: 'charmeleon',
    id: 4,
    base: {
      hp: 39,
      atk: 52,
      def: 43,
      spatk: 60,
      spdef: 50,
      speed: 65,
    },
    baseExp: 62,
    types: ['FIRE'],
    catchRate: 45,
    learnSet: {
      1: MOVE_SET.TACKLE,
      2: MOVE_SET.SCRATCH,
    },
  },
  CHARIZARD: {
    name: 'charizard',
    id: 4,
    base: {
      hp: 39,
      atk: 52,
      def: 43,
      spatk: 60,
      spdef: 50,
      speed: 65,
    },
    baseExp: 62,
    types: ['FIRE', 'FLYING'],
    catchRate: 45,
    learnSet: {
      1: MOVE_SET.TACKLE,
      2: MOVE_SET.SCRATCH,
    },
  },
  SQUIRTLE: {
    name: 'squirtle',
    id: 7,
    base: {
      hp: 44,
      atk: 48,
      def: 65,
      spatk: 50,
      spdef: 64,
      speed: 43,
    },
    baseExp: 63,
    catchRate: 45,
    types: ['WATER'],
    learnSet: {
      1: MOVE_SET.TACKLE,
      4: MOVE_SET.TAIL_WHIP,
    },
    evolves: {
      level: 16,
      into: 'WARTORTLE',
    },
  },
  WARTORTLE: {
    id: 8,
    name: 'wartortle',
    base: {
      hp: 100,
      atk: 100,
      def: 100,
      spatk: 100,
      spdef: 100,
      speed: 100,
    },
    types: ['WATER'],
    learnSet: {},
    catchRate: 100,
    baseExp: 142,
    evolves: {
      level: 36,
      into: 'BLASTOISE',
    },
  },
  BLASTOISE: {
    id: 9,
    name: 'blastoise',
    base: {
      hp: 100,
      atk: 100,
      def: 100,
      spatk: 100,
      spdef: 100,
      speed: 100,
    },
    types: ['WATER'],
    learnSet: {},
    catchRate: 100,
    baseExp: 239,
  },
  //    caterpie: {
  //        id: 10,
  //        name: "caterpie",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 39
  //    },
  //    metapod: {
  //        id: 11,
  //        name: "metapod",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 72
  //    },
  //    butterfree: {
  //        id: 12,
  //        name: "butterfree",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 178
  //    },
  //    weedle: {
  //        id: 13,
  //        name: "weedle",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 39
  //    },
  //    kakuna: {
  //        id: 14,
  //        name: "kakuna",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 72
  //    },
  //    beedrill: {
  //        id: 15,
  //        name: "beedrill",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 178
  //    },
  PIDGEY: {
    id: 16,
    name: 'pidgey',
    base: {
      hp: 100,
      atk: 100,
      def: 100,
      spatk: 100,
      spdef: 100,
      speed: 100,
    },
    types: ['NORMAL', 'FLYING'],
    learnSet: {},
    catchRate: 100,
    baseExp: 55,
  },
  //    pidgeotto: {
  //        id: 17,
  //        name: "pidgeotto",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 122
  //    },
  //    pidgeot: {
  //        id: 18,
  //        name: "pidgeot",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 216
  //    },
  RATTATA: {
    id: 19,
    name: 'rattata',
    base: {
      hp: 100,
      atk: 100,
      def: 100,
      spatk: 100,
      spdef: 100,
      speed: 100,
    },
    types: ['NORMAL'],
    learnSet: {},
    catchRate: 100,
    baseExp: 57,
  },
  //    raticate: {
  //        id: 20,
  //        name: "raticate",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 145
  //    },
  //    spearow: {
  //        id: 21,
  //        name: "spearow",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 52
  //    },
  //    fearow: {
  //        id: 22,
  //        name: "fearow",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 155
  //    },
  //    ekans: {
  //        id: 23,
  //        name: "ekans",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 58
  //    },
  //    arbok: {
  //        id: 24,
  //        name: "arbok",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 153
  //    },
  PIKACHU: {
    name: 'Pikachū',
    id: 25,
    base: {
      hp: 35,
      atk: 55,
      def: 33,
      spatk: 50,
      spdef: 40,
      speed: 90,
    },
    baseExp: 112,
    catchRate: 190,
    types: ['ELECTRIC'],
    learnSet: {
      1: MOVE_SET.TACKLE,
      5: MOVE_SET.GROWL,
      2: MOVE_SET.THUNDER_SHOCK,
    },
  },
  //    raichu: {
  //        id: 26,
  //        name: "raichu",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 218
  //    },
  //    sandshrew: {
  //        id: 27,
  //        name: "sandshrew",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 60
  //    },
  //    sandslash: {
  //        id: 28,
  //        name: "sandslash",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 158
  //    },
  //    "nidoran-f": {
  //        id: 29,
  //        name: "nidoran-f",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 55
  //    },
  //    nidorina: {
  //        id: 30,
  //        name: "nidorina",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 128
  //    },
  //    nidoqueen: {
  //        id: 31,
  //        name: "nidoqueen",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 227
  //    },
  //    "nidoran-m": {
  //        id: 32,
  //        name: "nidoran-m",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 55
  //    },
  //    nidorino: {
  //        id: 33,
  //        name: "nidorino",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 128
  //    },
  //    nidoking: {
  //        id: 34,
  //        name: "nidoking",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 227
  //    },
  //    clefairy: {
  //        id: 35,
  //        name: "clefairy",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 113
  //    },
  //    clefable: {
  //        id: 36,
  //        name: "clefable",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 217
  //    },
  //    vulpix: {
  //        id: 37,
  //        name: "vulpix",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 60
  //    },
  //    ninetales: {
  //        id: 38,
  //        name: "ninetales",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 177
  //    },
  //    jigglypuff: {
  //        id: 39,
  //        name: "jigglypuff",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 95
  //    },
  //    wigglytuff: {
  //        id: 40,
  //        name: "wigglytuff",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 196
  //    },
  //    zubat: {
  //        id: 41,
  //        name: "zubat",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 49
  //    },
  //    golbat: {
  //        id: 42,
  //        name: "golbat",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 159
  //    },
  //    oddish: {
  //        id: 43,
  //        name: "oddish",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 64
  //    },
  //    gloom: {
  //        id: 44,
  //        name: "gloom",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 138
  //    },
  //    vileplume: {
  //        id: 45,
  //        name: "vileplume",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 221
  //    },
  //    paras: {
  //        id: 46,
  //        name: "paras",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 57
  //    },
  //    parasect: {
  //        id: 47,
  //        name: "parasect",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 142
  //    },
  //    venonat: {
  //        id: 48,
  //        name: "venonat",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 61
  //    },
  //    venomoth: {
  //        id: 49,
  //        name: "venomoth",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 158
  //    },
  //    diglett: {
  //        id: 50,
  //        name: "diglett",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 53
  //    },
  //    dugtrio: {
  //        id: 51,
  //        name: "dugtrio",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 142
  //    },
  //    meowth: {
  //        id: 52,
  //        name: "meowth",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 58
  //    },
  //    persian: {
  //        id: 53,
  //        name: "persian",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 154
  //    },
  //    psyduck: {
  //        id: 54,
  //        name: "psyduck",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 64
  //    },
  //    golduck: {
  //        id: 55,
  //        name: "golduck",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 175
  //    },
  //    mankey: {
  //        id: 56,
  //        name: "mankey",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 61
  //    },
  //    primeape: {
  //        id: 57,
  //        name: "primeape",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 159
  //    },
  //    growlithe: {
  //        id: 58,
  //        name: "growlithe",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 70
  //    },
  //    arcanine: {
  //        id: 59,
  //        name: "arcanine",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 194
  //    },
  //    poliwag: {
  //        id: 60,
  //        name: "poliwag",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 60
  //    },
  //    poliwhirl: {
  //        id: 61,
  //        name: "poliwhirl",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 135
  //    },
  //    poliwrath: {
  //        id: 62,
  //        name: "poliwrath",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 230
  //    },
  //    abra: {
  //        id: 63,
  //        name: "abra",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 62
  //    },
  //    kadabra: {
  //        id: 64,
  //        name: "kadabra",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 140
  //    },
  //    alakazam: {
  //        id: 65,
  //        name: "alakazam",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 225
  //    },
  //    machop: {
  //        id: 66,
  //        name: "machop",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 61
  //    },
  //    machoke: {
  //        id: 67,
  //        name: "machoke",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 142
  //    },
  //    machamp: {
  //        id: 68,
  //        name: "machamp",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 227
  //    },
  //    bellsprout: {
  //        id: 69,
  //        name: "bellsprout",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 60
  //    },
  //    weepinbell: {
  //        id: 70,
  //        name: "weepinbell",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 137
  //    },
  //    victreebel: {
  //        id: 71,
  //        name: "victreebel",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 221
  //    },
  //    tentacool: {
  //        id: 72,
  //        name: "tentacool",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 67
  //    },
  //    tentacruel: {
  //        id: 73,
  //        name: "tentacruel",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 180
  //    },
  //    geodude: {
  //        id: 74,
  //        name: "geodude",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 60
  //    },
  //    graveler: {
  //        id: 75,
  //        name: "graveler",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 137
  //    },
  //    golem: {
  //        id: 76,
  //        name: "golem",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 223
  //    },
  //    ponyta: {
  //        id: 77,
  //        name: "ponyta",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 82
  //    },
  //    rapidash: {
  //        id: 78,
  //        name: "rapidash",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 175
  //    },
  //    slowpoke: {
  //        id: 79,
  //        name: "slowpoke",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 63
  //    },
  //    slowbro: {
  //        id: 80,
  //        name: "slowbro",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 172
  //    },
  //    magnemite: {
  //        id: 81,
  //        name: "magnemite",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 65
  //    },
  //    magneton: {
  //        id: 82,
  //        name: "magneton",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 163
  //    },
  //    farfetchd: {
  //        id: 83,
  //        name: "farfetchd",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 123
  //    },
  //    doduo: {
  //        id: 84,
  //        name: "doduo",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 62
  //    },
  //    dodrio: {
  //        id: 85,
  //        name: "dodrio",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 161
  //    },
  //    seel: {
  //        id: 86,
  //        name: "seel",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 65
  //    },
  //    dewgong: {
  //        id: 87,
  //        name: "dewgong",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 166
  //    },
  //    grimer: {
  //        id: 88,
  //        name: "grimer",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 65
  //    },
  //    muk: {
  //        id: 89,
  //        name: "muk",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 175
  //    },
  //    shellder: {
  //        id: 90,
  //        name: "shellder",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 61
  //    },
  //    cloyster: {
  //        id: 91,
  //        name: "cloyster",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 184
  //    },
  //    gastly: {
  //        id: 92,
  //        name: "gastly",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 62
  //    },
  //    haunter: {
  //        id: 93,
  //        name: "haunter",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 142
  //    },
  //    gengar: {
  //        id: 94,
  //        name: "gengar",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 225
  //    },
  //    onix: {
  //        id: 95,
  //        name: "onix",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 77
  //    },
  //    drowzee: {
  //        id: 96,
  //        name: "drowzee",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 66
  //    },
  //    hypno: {
  //        id: 97,
  //        name: "hypno",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 169
  //    },
  //    krabby: {
  //        id: 98,
  //        name: "krabby",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 65
  //    },
  //    kingler: {
  //        id: 99,
  //        name: "kingler",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 166
  //    },
  //    voltorb: {
  //        id: 100,
  //        name: "voltorb",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 66
  //    },
  //    electrode: {
  //        id: 101,
  //        name: "electrode",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 168
  //    },
  //    exeggcute: {
  //        id: 102,
  //        name: "exeggcute",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 65
  //    },
  //    exeggutor: {
  //        id: 103,
  //        name: "exeggutor",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 182
  //    },
  //    cubone: {
  //        id: 104,
  //        name: "cubone",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 64
  //    },
  //    marowak: {
  //        id: 105,
  //        name: "marowak",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 149
  //    },
  //    hitmonlee: {
  //        id: 106,
  //        name: "hitmonlee",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 159
  //    },
  //    hitmonchan: {
  //        id: 107,
  //        name: "hitmonchan",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 159
  //    },
  //    lickitung: {
  //        id: 108,
  //        name: "lickitung",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 77
  //    },
  //    koffing: {
  //        id: 109,
  //        name: "koffing",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 68
  //    },
  //    weezing: {
  //        id: 110,
  //        name: "weezing",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 172
  //    },
  //    rhyhorn: {
  //        id: 111,
  //        name: "rhyhorn",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 69
  //    },
  //    rhydon: {
  //        id: 112,
  //        name: "rhydon",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 170
  //    },
  //    chansey: {
  //        id: 113,
  //        name: "chansey",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 395
  //    },
  //    tangela: {
  //        id: 114,
  //        name: "tangela",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 87
  //    },
  //    kangaskhan: {
  //        id: 115,
  //        name: "kangaskhan",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 172
  //    },
  //    horsea: {
  //        id: 116,
  //        name: "horsea",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 59
  //    },
  //    seadra: {
  //        id: 117,
  //        name: "seadra",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 154
  //    },
  //    goldeen: {
  //        id: 118,
  //        name: "goldeen",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 64
  //    },
  //    seaking: {
  //        id: 119,
  //        name: "seaking",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 158
  //    },
  //    staryu: {
  //        id: 120,
  //        name: "staryu",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 68
  //    },
  //    starmie: {
  //        id: 121,
  //        name: "starmie",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 182
  //    },
  //    "mr-mime": {
  //        id: 122,
  //        name: "mr-mime",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 161
  //    },
  //    scyther: {
  //        id: 123,
  //        name: "scyther",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 100
  //    },
  //    jynx: {
  //        id: 124,
  //        name: "jynx",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 159
  //    },
  //    electabuzz: {
  //        id: 125,
  //        name: "electabuzz",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 172
  //    },
  //    magmar: {
  //        id: 126,
  //        name: "magmar",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 173
  //    },
  //    pinsir: {
  //        id: 127,
  //        name: "pinsir",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 175
  //    },
  //    tauros: {
  //        id: 128,
  //        name: "tauros",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 172
  //    },
  //    magikarp: {
  //        id: 129,
  //        name: "magikarp",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 40
  //    },
  //    gyarados: {
  //        id: 130,
  //        name: "gyarados",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 189
  //    },
  //    lapras: {
  //        id: 131,
  //        name: "lapras",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 187
  //    },
  //    ditto: {
  //        id: 132,
  //        name: "ditto",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 101
  //    },
  EEVEE: {
    name: 'eevee',
    id: 133,
    base: {
      hp: 55,
      atk: 55,
      def: 50,
      spatk: 45,
      spdef: 65,
      speed: 55,
    },
    baseExp: 65,
    types: ['NORMAL'],
    catchRate: 45,
    learnSet: {
      1: MOVE_SET.SCRATCH,
      2: MOVE_SET.GROWL,
    },
  },
  //    vaporeon: {
  //        id: 134,
  //        name: "vaporeon",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 184
  //    },
  //    jolteon: {
  //        id: 135,
  //        name: "jolteon",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 184
  //    },
  //    flareon: {
  //        id: 136,
  //        name: "flareon",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 184
  //    },
  //    porygon: {
  //        id: 137,
  //        name: "porygon",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 79
  //    },
  //    omanyte: {
  //        id: 138,
  //        name: "omanyte",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 71
  //    },
  //    omastar: {
  //        id: 139,
  //        name: "omastar",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 173
  //    },
  //    kabuto: {
  //        id: 140,
  //        name: "kabuto",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 71
  //    },
  //    kabutops: {
  //        id: 141,
  //        name: "kabutops",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 173
  //    },
  //    aerodactyl: {
  //        id: 142,
  //        name: "aerodactyl",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 180
  //    },
  //    snorlax: {
  //        id: 143,
  //        name: "snorlax",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 189
  //    },
  //    articuno: {
  //        id: 144,
  //        name: "articuno",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 261
  //    },
  //    zapdos: {
  //        id: 145,
  //        name: "zapdos",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 261
  //    },
  //    moltres: {
  //        id: 146,
  //        name: "moltres",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 261
  //    },
  //    dratini: {
  //        id: 147,
  //        name: "dratini",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 60
  //    },
  //    dragonair: {
  //        id: 148,
  //        name: "dragonair",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 147
  //    },
  //    dragonite: {
  //        id: 149,
  //        name: "dragonite",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 270
  //    },
  //    mewtwo: {
  //        id: 150,
  //        name: "mewtwo",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 306
  //    },
  //    mew: {
  //        id: 151,
  //        name: "mew",
  //        base: {
  //            hp: 100,
  //            atk: 100,
  //            def: 100,
  //            spatk: 100,
  //            spdef: 100,
  //            speed: 100
  //        },
  //        types: [],
  //        learnSet: {},
  //        catchRate: 100,
  //          //        baseExp: 270
  //    }
};
