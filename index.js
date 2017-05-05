/**
 * This skill is a Pokemon adventure game built with the Amazon Alexa Skills Kit.
 */

var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    NAMEMODE: '_NAMEMODE',
    RIVALMODE: '_RIVALMODE',
    MOVEMENTMODE: '_MOVEMENTMODE',
    CHOOSEPOKEMONMODE: '_CHOOSEPOKEMONMODE',
    BATTLEMODE: '_BATTLEMODE',
    CHOOSEMOVEMODE: '_CHOOSEMOVEMODE',
    SWITCHPOKEMODE: '_SWITCHPOKEMODE',
    BAGMODE: '_BAGMODE',
    WHITEOUTMODE: '_WHITEOUTMODE',
    POKECENTERMODE: '_POKECENTERMODE',
    POKEMARTMODE: '_POKEMARTMODE',
    CITYMODE: '_CITYMODE',
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};

var locations = {
    'pallet town': {
        name: "pallet town",
        buildings: [],
        type: 'city',
        next: 'route 1',
        gym: null
    },
    'route 1': {
        pokemon: {
            pidgey: 50,
            rattata: 50
        },
        trainers: 10,
        grass: 60,
        items: ['potion', 'pokeball'],
        type: 'route',
        next: 'viridian forest'
    },
    'viridian forest': {
        pokemon: {
            caterpie: 40,
            weedle: 40,
            kakuna: 7.5,
            metapod: 7.5,
            Pikachū: 5
        },
        trainers: 30,
        grass: 85,
        items: ['potion', 'pokeball', 'fullheal'],
        type: 'route',
        next: 'viridian city'
    },
    'viridian city': {
        name: 'viridian city',
        buildings: ['pokemart', 'pokecenter', 'gym'],
        type: 'city',
        gym: null,
        next: 'route 2'
    }
};
var attacks = {
    'growl':{
        'name': 'growl',
        'type': 'normal',
        'cat': 'status',
        'power': 0,
        'acc': 100,
        'pp': 40,
        'modifier':{
            'self': true,
            'atk': 1
        }
    },
    'tackle':{
        'name': 'tackle',
        'type': 'normal',
        'cat': 'physical',
        'power': 40,
        'acc': 100,
        'pp': 35
    },
    'scratch':{
        'name': 'scratch',
        'type': 'normal',
        'cat': 'physical',
        'power': 40,
        'acc': 100,
        'pp': 35
    },
    'tailwhip':{
        'name': 'tailwhip',
        'type': 'normal',
        'cat': 'status',
        'power': 0,
        'acc': 100,
        'pp': 30,
        'modifier':{
            'self': false,
            'def': -1
        }
    },
    'thundershock': {
        'name': 'thundershock',
        'type': 'electric',
        'cat': 'special',
        'power': 40,
        'acc': 100,
        'pp': 30
    },
    'leechseed': {
        'name': 'leechseed',
        'type': 'grass',
        'cat': 'status',
        'power': 0,
        'acc': 90,
        'pp': 10,
        //not implemented yet
        'modifier': {
            'self': false,
            'hp': 1
        }
    },
    'vinewhip': {
        'name': 'vinewhip',
        'type': 'grass',
        'cat': 'physical',
        'power': 35,
        'acc': 100,
        'pp': 10
    },
    'poisonpowder': {
        'name': 'poisonpowder',
        'type': 'poison',
        'cat': 'status',
        'status': 'poison',
        'power': 0,
        'acc': 75,
        'pp': 35
    },
    'sleeppowder':{
        'name': 'sleeppowder',
        'type': 'grass',
        'acc': 75,
        'cat': 'status',
        'status': 'sleep',
        'pp': 15
    },
    'growth': {
        'name': 'growth',
        'type': 'normal',
        'cat': 'status',
        'acc': 100,
        'modifier': {
            'self': true,
            'spatk': 1
        }
    },
    'razorleaf': {
        'name': 'razorleaf',
        'type': 'grass',
        'cat': 'status',
        'acc': 95,
        'power': 55
    },
    'solarbeam': {
        'name': 'solarbeam',
        'type': 'grass',
        'cat': 'special',
        'acc': 100,
        'power': 120,
        'pp': 10
    }
};
var modifiers = {
    '-6': 0.33,
    '-5': 0.36,
    '-4': 0.43,
    '-3': 0.5,
    '-2': 0.6,
    '-1': 0.75,
    '0': 1,
    '1': 1.33,
    '2': 1.66,
    '3': 2,
    '4': 2.33,
    '5': 2.66,
    '6': 3
};
var typeChart = {
    normal   : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:0.5, 	bug:1,    ghost:0,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:1,	ice:1,	  dragon:1,	  dark:1},
    fight    : {normal: 2,   fighting:1,	 flying:0.5,poison:0.5,	ground:1,	rock:2, 	bug:0.5,  ghost:0,    steel:2,      fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:0.5,	ice:2,	  dragon:1,	  dark:1},
    flying   : {normal: 1,   fighting:2,	 flying:1,	poison:1,	ground:1,	rock:0.5, 	bug:2,    ghost:1,    steel:0.5,    fire:1,	   water:1,	 grass:2,	electric:0.5, psychic:1,	ice:1,	  dragon:1,	  dark:1},
    poison   : {normal: 1,   fighting:1,	 flying:1,	poison:0.5,	ground:0.5,	rock:0.5, 	bug:1,    ghost:0.5,  steel:0,      fire:1,	   water:1,	 grass:2,	electric:1,	  psychic:1,	ice:1,	  dragon:1,	  dark:1},
    ground   : {normal: 1,   fighting:1,	 flying:0,	poison:2,	ground:1,	rock:2, 	bug:0.5,  ghost:1,    steel:2,      fire:2,	   water:1,	 grass:0.5,	electric:2,	  psychic:1,	ice:1,	  dragon:1,	  dark:1},
    rock     : {normal: 1,   fighting:0.5,	 flying:2,	poison:1,	ground:0.5,	rock:1, 	bug:2,    ghost:1,    steel:0.5,    fire:2,	   water:1,	 grass:1,	electric:1,	  psychic:1,	ice:2,	  dragon:1,	  dark:1},
    bug      : {normal: 1,   fighting:0.5,	 flying:0.5,poison:0.5,	ground:1,	rock:1, 	bug:1,    ghost:0.5,  steel:0.5,    fire:0.5,  water:1,	 grass:2,	electric:1,	  psychic:2,	ice:1,	  dragon:1,	  dark:1},
    ghost    : {normal: 0,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:1, 	bug:1,    ghost:2,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:2,	ice:1,	  dragon:1,	  dark:1},
    steel    : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:2, 	bug:1,    ghost:1,    steel:0.5,    fire:0.5,  water:0.5,grass:1,	electric:0.5, psychic:1,	ice:2,	  dragon:1,	  dark:1},
    fire     : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:0.5, 	bug:2,    ghost:1,    steel:2,      fire:0.5,  water:0.5,grass:2,	electric:1,	  psychic:1,	ice:2,	  dragon:0.5, dark:1},
    water    : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:2,	rock:2, 	bug:1,    ghost:1,    steel:1,      fire:2,	   water:0.5,grass:0.5,	electric:1,	  psychic:1,	ice:1,	  dragon:0.5, dark:1},
    grass    : {normal: 1,   fighting:1,	 flying:0.5,poison:0.5,	ground:2,	rock:2, 	bug:0.5,  ghost:1,    steel:0.5,    fire:0.5,  water:2,	 grass:0.5,	electric:1,	  psychic:1,	ice:1,	  dragon:0.5, dark:1},
    electric : {normal: 1,   fighting:1,	 flying:2,	poison:1,	ground:0,	rock:1, 	bug:1,    ghost:1,    steel:1,      fire:1,	   water:2,	 grass:0.5,	electric:0.5, psychic:1,	ice:1,	  dragon:0.5, dark:1},
    psychic  : {normal: 1,   fighting:2,	 flying:1,	poison:2,	ground:1,	rock:1, 	bug:1,    ghost:1,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:0.5,	ice:1,	  dragon:1,	  dark:1},
    ice      : {normal: 1,   fighting:1,	 flying:2,	poison:1,	ground:2,	rock:1, 	bug:1,    ghost:1,    steel:0.5,    fire:0.5,  water:0.5,grass:2,	electric:1,	  psychic:1,	ice:0.5,  dragon:2,	  dark:1},
    dragon   : {normal: 1,   fighting:1,	 flying:1,	poison:1,	ground:1,	rock:1, 	bug:1,    ghost:1,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:1,	ice:1,	  dragon:2,	  dark:1},
    dark     : {normal: 1,   fighting:0.5,	 flying:1,	poison:1,	ground:1,	rock:1, 	bug:1,    ghost:2,    steel:0.5,    fire:1,	   water:1,	 grass:1,	electric:1,	  psychic:2,	ice:1,	  dragon:1,	  dark:1}
};
var items = {
    potion : {
        name: 'potion',
        count: 0,
        price: 200,
        type: "healing",
        hp: 20
    },
    superpotion : {
        name: 'superpotion',
        count: 0,
        price: 700,
        type: "healing",
        hp: 50
    },
    hyperpotion: {
        name: 'hyperpotion',
        count: 0,
        price: 1500,
        type: "healing",
        hp: 200
    },
    maxpotion: {
        name: 'maxpotion',
        count: 0,
        price: 2500,
        type: "healing",
        hp: 9999999
    },
    fullrestore: {
        name: 'fullrestore',
        count: 0,
        price: 3000,
        type: 'restore',
        hp: 999999,
        status: 'all'
    },
    fullheal: {
        name: 'fullheal',
        count: 0,
        price: 600,
        type: 'restore',
        hp: 0,
        status: 'all'
    },
    pokéball: {
        name: 'pokéball',
        count: 0,
        price: 200,
        type: 'ball',
        catchrate: 1
    },
    greatball: {
        name: 'greatball',
        count: 0,
        price: 600,
        type: 'ball',
        catchrate: 1.5
    },
    ultraball: {
        name: 'ultraball',
        count: 0,
        price: 1200,
        type: 'ball',
        catchrate: 2
    },
    masterball: {
        name: 'masterball',
        count: 0,
        price: 999999,
        type: 'ball',
        catchrate: 255
    }
};

//Pokemon constants only
var Pokemon = {
    'bulbasaur':{
        'name': 'bulbasaur',
        'id': 1,
        'base':{
            'hp': 45,
            'atk': 49,
            'def': 49,
            'spatk': 65,
            'spdef': 65,
            'speed': 45
        },
        'baseExp': 64,
        'types': ['grass', 'poison'],
        'learnset': {
            '1': attacks.tackle,
            '3': attacks.growl,
            '7': attacks.leechseed,
            '13': attacks.vinewhip,
            '20': attacks.poisonpowder,
            '27': attacks.razorleaf,
            '34': attacks.growth,
            '41': attacks.sleeppowder,
            '48': attacks.solarbeam
        },
        'catchrate': 45,
        'evolves': {
            level: 16,
            into: 'ivysaur'
        }
    },
    'ivysaur': {
        'name': 'ivysaur',
        'id': 2,
        'base':{
            'hp': 60,
            'atk': 62,
            'def': 63,
            'spatk': 80,
            'spdef': 80,
            'speed': 60
        },
        'baseExp': 142,
        'types': ['grass', 'poison'],
        'learnset': {
            '1': attacks.tackle,
            '3': attacks.growl,
            '7': attacks.leechseed,
            '13': attacks.vinewhip,
            '22': attacks.poisonpowder,
            '30': attacks.razorleaf,
            '38': attacks.growth,
            '46': attacks.sleeppowder,
            '54': attacks.solarbeam
        },
        'catchrate': 45,
        'evolves': {
            level: 32,
            into: 'venusaur'
        }
    },
    'venusaur': {
        'name': 'venusaur',
        'id': 3,
        'base': {
            'hp': 80,
            'atk': 82,
            'def': 83,
            'spatk': 100,
            'spdef': 100,
            'speed': 80
        },
        'baseExp': 236,
        'types': ['grass', 'poison'],
        'learnset': {
            '1': attacks.tackle,
            '3': attacks.growl,
            '7': attacks.leechseed,
            '13': attacks.vinewhip,
            '22': attacks.poisonpowder,
            '30': attacks.razorleaf,
            '43': attacks.growth,
            '55': attacks.sleeppowder,
            '65': attacks.solarbeam
        },
        'catchrate': 45,
        'evolves': null
    },
    'charmander':{
        'name': 'charmander',
        'id': 4,
        'base':{
            'hp': 39,
            'atk': 52,
            'def': 43,
            'spatk': 60,
            'spdef': 50,
            'speed': 65
        },
        'baseExp': 62,
        'types': ['fire', ''],
        'learnset': {
            '1': attacks.tackle,
            '2': attacks.scratch
        }
    },
    'squirtle':{
        'name': 'squirtle',
        'id': 7,
        'base':{
            'hp': 44,
            'atk': 48,
            'def': 65,
            'spatk': 50,
            'spdef': 64,
            'speed': 43
        },
        'baseExp': 63,
        'types': ['water', ''],
        'learnset': {
            '1': attacks.tackle,
            '4': attacks.tailwhip
        }
    },
//    "wartortle": {
//        "id": 8,
//        "name": "wartortle",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 142
//    },
//    "blastoise": {
//        "id": 9,
//        "name": "blastoise",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 239
//    },
//    "caterpie": {
//        "id": 10,
//        "name": "caterpie",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 39
//    },
//    "metapod": {
//        "id": 11,
//        "name": "metapod",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 72
//    },
//    "butterfree": {
//        "id": 12,
//        "name": "butterfree",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 178
//    },
//    "weedle": {
//        "id": 13,
//        "name": "weedle",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 39
//    },
//    "kakuna": {
//        "id": 14,
//        "name": "kakuna",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 72
//    },
//    "beedrill": {
//        "id": 15,
//        "name": "beedrill",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 178
//    },
//    "pidgey": {
//        "id": 16,
//        "name": "pidgey",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 50
//    },
//    "pidgeotto": {
//        "id": 17,
//        "name": "pidgeotto",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 122
//    },
//    "pidgeot": {
//        "id": 18,
//        "name": "pidgeot",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 216
//    },
//    "rattata": {
//        "id": 19,
//        "name": "rattata",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 51
//    },
//    "raticate": {
//        "id": 20,
//        "name": "raticate",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 145
//    },
//    "spearow": {
//        "id": 21,
//        "name": "spearow",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 52
//    },
//    "fearow": {
//        "id": 22,
//        "name": "fearow",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 155
//    },
//    "ekans": {
//        "id": 23,
//        "name": "ekans",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 58
//    },
//    "arbok": {
//        "id": 24,
//        "name": "arbok",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 153
//    },
    'Pikachū': {
        'name': 'Pikachū',
        'id': 25,
        'base': {
            'hp': 35,
            'atk': 55,
            'def': 33,
            'spatk': 50,
            'spdef': 40,
            'speed': 90
        },
        'baseExp': 112,
        'types': ['electric', ''],
        'learnset': {
            '1': attacks.tackle,
            '5': attacks.growl,
            '2': attacks.thundershock
        }
    },
//    "raichu": {
//        "id": 26,
//        "name": "raichu",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 218
//    },
//    "sandshrew": {
//        "id": 27,
//        "name": "sandshrew",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 60
//    },
//    "sandslash": {
//        "id": 28,
//        "name": "sandslash",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 158
//    },
//    "nidoran-f": {
//        "id": 29,
//        "name": "nidoran-f",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 55
//    },
//    "nidorina": {
//        "id": 30,
//        "name": "nidorina",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 128
//    },
//    "nidoqueen": {
//        "id": 31,
//        "name": "nidoqueen",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 227
//    },
//    "nidoran-m": {
//        "id": 32,
//        "name": "nidoran-m",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 55
//    },
//    "nidorino": {
//        "id": 33,
//        "name": "nidorino",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 128
//    },
//    "nidoking": {
//        "id": 34,
//        "name": "nidoking",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 227
//    },
//    "clefairy": {
//        "id": 35,
//        "name": "clefairy",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 113
//    },
//    "clefable": {
//        "id": 36,
//        "name": "clefable",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 217
//    },
//    "vulpix": {
//        "id": 37,
//        "name": "vulpix",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 60
//    },
//    "ninetales": {
//        "id": 38,
//        "name": "ninetales",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 177
//    },
//    "jigglypuff": {
//        "id": 39,
//        "name": "jigglypuff",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 95
//    },
//    "wigglytuff": {
//        "id": 40,
//        "name": "wigglytuff",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 196
//    },
//    "zubat": {
//        "id": 41,
//        "name": "zubat",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 49
//    },
//    "golbat": {
//        "id": 42,
//        "name": "golbat",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 159
//    },
//    "oddish": {
//        "id": 43,
//        "name": "oddish",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 64
//    },
//    "gloom": {
//        "id": 44,
//        "name": "gloom",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 138
//    },
//    "vileplume": {
//        "id": 45,
//        "name": "vileplume",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 221
//    },
//    "paras": {
//        "id": 46,
//        "name": "paras",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 57
//    },
//    "parasect": {
//        "id": 47,
//        "name": "parasect",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 142
//    },
//    "venonat": {
//        "id": 48,
//        "name": "venonat",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 61
//    },
//    "venomoth": {
//        "id": 49,
//        "name": "venomoth",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 158
//    },
//    "diglett": {
//        "id": 50,
//        "name": "diglett",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 53
//    },
//    "dugtrio": {
//        "id": 51,
//        "name": "dugtrio",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 142
//    },
//    "meowth": {
//        "id": 52,
//        "name": "meowth",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 58
//    },
//    "persian": {
//        "id": 53,
//        "name": "persian",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 154
//    },
//    "psyduck": {
//        "id": 54,
//        "name": "psyduck",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 64
//    },
//    "golduck": {
//        "id": 55,
//        "name": "golduck",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 175
//    },
//    "mankey": {
//        "id": 56,
//        "name": "mankey",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 61
//    },
//    "primeape": {
//        "id": 57,
//        "name": "primeape",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 159
//    },
//    "growlithe": {
//        "id": 58,
//        "name": "growlithe",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 70
//    },
//    "arcanine": {
//        "id": 59,
//        "name": "arcanine",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 194
//    },
//    "poliwag": {
//        "id": 60,
//        "name": "poliwag",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 60
//    },
//    "poliwhirl": {
//        "id": 61,
//        "name": "poliwhirl",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 135
//    },
//    "poliwrath": {
//        "id": 62,
//        "name": "poliwrath",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 230
//    },
//    "abra": {
//        "id": 63,
//        "name": "abra",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 62
//    },
//    "kadabra": {
//        "id": 64,
//        "name": "kadabra",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 140
//    },
//    "alakazam": {
//        "id": 65,
//        "name": "alakazam",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 225
//    },
//    "machop": {
//        "id": 66,
//        "name": "machop",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 61
//    },
//    "machoke": {
//        "id": 67,
//        "name": "machoke",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 142
//    },
//    "machamp": {
//        "id": 68,
//        "name": "machamp",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 227
//    },
//    "bellsprout": {
//        "id": 69,
//        "name": "bellsprout",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 60
//    },
//    "weepinbell": {
//        "id": 70,
//        "name": "weepinbell",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 137
//    },
//    "victreebel": {
//        "id": 71,
//        "name": "victreebel",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 221
//    },
//    "tentacool": {
//        "id": 72,
//        "name": "tentacool",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 67
//    },
//    "tentacruel": {
//        "id": 73,
//        "name": "tentacruel",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 180
//    },
//    "geodude": {
//        "id": 74,
//        "name": "geodude",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 60
//    },
//    "graveler": {
//        "id": 75,
//        "name": "graveler",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 137
//    },
//    "golem": {
//        "id": 76,
//        "name": "golem",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 223
//    },
//    "ponyta": {
//        "id": 77,
//        "name": "ponyta",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 82
//    },
//    "rapidash": {
//        "id": 78,
//        "name": "rapidash",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 175
//    },
//    "slowpoke": {
//        "id": 79,
//        "name": "slowpoke",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 63
//    },
//    "slowbro": {
//        "id": 80,
//        "name": "slowbro",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 172
//    },
//    "magnemite": {
//        "id": 81,
//        "name": "magnemite",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 65
//    },
//    "magneton": {
//        "id": 82,
//        "name": "magneton",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 163
//    },
//    "farfetchd": {
//        "id": 83,
//        "name": "farfetchd",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 123
//    },
//    "doduo": {
//        "id": 84,
//        "name": "doduo",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 62
//    },
//    "dodrio": {
//        "id": 85,
//        "name": "dodrio",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 161
//    },
//    "seel": {
//        "id": 86,
//        "name": "seel",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 65
//    },
//    "dewgong": {
//        "id": 87,
//        "name": "dewgong",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 166
//    },
//    "grimer": {
//        "id": 88,
//        "name": "grimer",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 65
//    },
//    "muk": {
//        "id": 89,
//        "name": "muk",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 175
//    },
//    "shellder": {
//        "id": 90,
//        "name": "shellder",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 61
//    },
//    "cloyster": {
//        "id": 91,
//        "name": "cloyster",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 184
//    },
//    "gastly": {
//        "id": 92,
//        "name": "gastly",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 62
//    },
//    "haunter": {
//        "id": 93,
//        "name": "haunter",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 142
//    },
//    "gengar": {
//        "id": 94,
//        "name": "gengar",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 225
//    },
//    "onix": {
//        "id": 95,
//        "name": "onix",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 77
//    },
//    "drowzee": {
//        "id": 96,
//        "name": "drowzee",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 66
//    },
//    "hypno": {
//        "id": 97,
//        "name": "hypno",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 169
//    },
//    "krabby": {
//        "id": 98,
//        "name": "krabby",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 65
//    },
//    "kingler": {
//        "id": 99,
//        "name": "kingler",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 166
//    },
//    "voltorb": {
//        "id": 100,
//        "name": "voltorb",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 66
//    },
//    "electrode": {
//        "id": 101,
//        "name": "electrode",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 168
//    },
//    "exeggcute": {
//        "id": 102,
//        "name": "exeggcute",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 65
//    },
//    "exeggutor": {
//        "id": 103,
//        "name": "exeggutor",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 182
//    },
//    "cubone": {
//        "id": 104,
//        "name": "cubone",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 64
//    },
//    "marowak": {
//        "id": 105,
//        "name": "marowak",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 149
//    },
//    "hitmonlee": {
//        "id": 106,
//        "name": "hitmonlee",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 159
//    },
//    "hitmonchan": {
//        "id": 107,
//        "name": "hitmonchan",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 159
//    },
//    "lickitung": {
//        "id": 108,
//        "name": "lickitung",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 77
//    },
//    "koffing": {
//        "id": 109,
//        "name": "koffing",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 68
//    },
//    "weezing": {
//        "id": 110,
//        "name": "weezing",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 172
//    },
//    "rhyhorn": {
//        "id": 111,
//        "name": "rhyhorn",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 69
//    },
//    "rhydon": {
//        "id": 112,
//        "name": "rhydon",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 170
//    },
//    "chansey": {
//        "id": 113,
//        "name": "chansey",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 395
//    },
//    "tangela": {
//        "id": 114,
//        "name": "tangela",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 87
//    },
//    "kangaskhan": {
//        "id": 115,
//        "name": "kangaskhan",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 172
//    },
//    "horsea": {
//        "id": 116,
//        "name": "horsea",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 59
//    },
//    "seadra": {
//        "id": 117,
//        "name": "seadra",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 154
//    },
//    "goldeen": {
//        "id": 118,
//        "name": "goldeen",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 64
//    },
//    "seaking": {
//        "id": 119,
//        "name": "seaking",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 158
//    },
//    "staryu": {
//        "id": 120,
//        "name": "staryu",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 68
//    },
//    "starmie": {
//        "id": 121,
//        "name": "starmie",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 182
//    },
//    "mr-mime": {
//        "id": 122,
//        "name": "mr-mime",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 161
//    },
//    "scyther": {
//        "id": 123,
//        "name": "scyther",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 100
//    },
//    "jynx": {
//        "id": 124,
//        "name": "jynx",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 159
//    },
//    "electabuzz": {
//        "id": 125,
//        "name": "electabuzz",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 172
//    },
//    "magmar": {
//        "id": 126,
//        "name": "magmar",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 173
//    },
//    "pinsir": {
//        "id": 127,
//        "name": "pinsir",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 175
//    },
//    "tauros": {
//        "id": 128,
//        "name": "tauros",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 172
//    },
//    "magikarp": {
//        "id": 129,
//        "name": "magikarp",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 40
//    },
//    "gyarados": {
//        "id": 130,
//        "name": "gyarados",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 189
//    },
//    "lapras": {
//        "id": 131,
//        "name": "lapras",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 187
//    },
//    "ditto": {
//        "id": 132,
//        "name": "ditto",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 101
//    },
    'eevee': {
        'name': 'eevee',
        'id': 133,
        'base': {
            'hp': 55,
            'atk': 55,
            'def': 50,
            'spatk': 45,
            'spdef': 65,
            'speed': 55
        },
        'baseExp': 65,
        'types': ['normal', ''],
        'learnset': {
            '1': attacks.scratch,
            '2': attacks.growl
        }
    },
//    "vaporeon": {
//        "id": 134,
//        "name": "vaporeon",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 184
//    },
//    "jolteon": {
//        "id": 135,
//        "name": "jolteon",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 184
//    },
//    "flareon": {
//        "id": 136,
//        "name": "flareon",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 184
//    },
//    "porygon": {
//        "id": 137,
//        "name": "porygon",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 79
//    },
//    "omanyte": {
//        "id": 138,
//        "name": "omanyte",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 71
//    },
//    "omastar": {
//        "id": 139,
//        "name": "omastar",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 173
//    },
//    "kabuto": {
//        "id": 140,
//        "name": "kabuto",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 71
//    },
//    "kabutops": {
//        "id": 141,
//        "name": "kabutops",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 173
//    },
//    "aerodactyl": {
//        "id": 142,
//        "name": "aerodactyl",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 180
//    },
//    "snorlax": {
//        "id": 143,
//        "name": "snorlax",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 189
//    },
//    "articuno": {
//        "id": 144,
//        "name": "articuno",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 261
//    },
//    "zapdos": {
//        "id": 145,
//        "name": "zapdos",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 261
//    },
//    "moltres": {
//        "id": 146,
//        "name": "moltres",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 261
//    },
//    "dratini": {
//        "id": 147,
//        "name": "dratini",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 60
//    },
//    "dragonair": {
//        "id": 148,
//        "name": "dragonair",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 147
//    },
//    "dragonite": {
//        "id": 149,
//        "name": "dragonite",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 270
//    },
//    "mewtwo": {
//        "id": 150,
//        "name": "mewtwo",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 306
//    },
//    "mew": {
//        "id": 151,
//        "name": "mew",
//        'base': {
//            'hp': ,
//            'atk': ,
//            'def': ,
//            'spatk': ,
//            'spdef': ,
//            'speed':
//        },
//        'types': [],
//        'learnset': {},
//        'catchrate': ,
//        'evolves': null,
//        "baseExp": 270
//    }
};
//need to build pokedex based on names in Pokemon object
var pokedex = ["squirtle", "charmander", "bulbasaur", "Pikachū", "eevee", "pidgey", "rattata"];

// This is the intial welcome message
var welcomeMessage = "Hello, there! Glad to meet you! Welcome to the world of Pokémon! My name is Oak. People affectionately refer to me as the Pokémon Professor. This world… …is inhabited far and wide by creatures called Pokémon! For some people, Pokémon are pets. Other use them for battling. As for myself… I study Pokémon as a profession. But first, tell me a little about yourself. Are you a boy or a girl?";
var goodbyeMessage = "Instead of continuing your adventure to become a Pokemon master, you go home to mom and live with her forever.";

// This is the message that is repeated if the response to the choose sex question is not heard
var repeatChooseSex = "Are you an Onix or a Cloyster?";

var battleOverMessage = "Would you like to continue on your journey now?";

// unhandled intent prompts
var unhandledSex = "There are only two genders in Kanto! Please say boy or girl.";
var unhandledGeneral = "I didn't quite catch that, can you repeat it?";
var unhandledPokemon = "This isn't Digimon, please select your starter Pokemon, Bulbasaur, Squirtle, or Charmander. If you have already chosen one, say yes to confirm or no to choose again.";

// help prompts
var helpChooseSex = "Do you want to start this pokemon journey or not? Now are you a boy or a girl?";
var helpName = "Please say the name of the requested character, such as, my name is Steve, or, her name is Jennifer";
var helpMovement = "Say yes to move to the next area.";
var helpChoosePokemon = "Please select your starter Pokemon, Bulbasaur, Squirtle, or Charmander. If you have already chosen one, say yes to confirm or no to choose again.";
var helpBattle = "Please say fight, open bag, switch pokemon, or run away.";

// bicycle easter egg
var bicycleMessage = "Oak's words echoed...There's a time and place for everything, but not now.";

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.dynamoDBTableName = 'RouteOneTable';
    alexa.registerHandlers(
        newSessionHandler,
        startGameHandlers,
        askNameHandlers,
        askRivalHandlers,
        askMovementHandlers,
        askPokemonHandlers,
        battleHandlers,
        chooseMoveHandlers,
        switchPokeHandlers,
        bagHandlers,
        whiteOutHandlers,
        pokeCenterHandlers,
        pokeMartHandlers,
        cityHandlers,
        askQuestionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.attributes['goodbyeMessage'] = " blacked out! ";
    this.attributes['movementState'] = 0;
    this.attributes['money'] = 0;
    this.attributes['bag'] = items;
    this.attributes['party'] = [];
    this.attributes['chosenItem'] = null;
    this.attributes['location'] = locations["pallet town"];
    this.attributes['lastVisitedCity'] = locations['pallet town'];
    this.emit(':ask', welcomeMessage, unhandledSex);
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', unhandledSex, repeatChooseSex);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {

    'SexIntent': function() {
        sex = this.event.request.intent.slots.Sex.value;
        this.attributes['sex'] = sex;
        var response = "Let's Begin with your name. What is it?";
        // set state to asking name
        this.handler.state = states.NAMEMODE;

        // ask the next question
        this.emit(':ask', response, response);
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', helpChooseSex, helpChooseSex);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpChooseSex, helpChooseSex);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledSex, unhandledSex);
    }
});

var askNameHandlers = Alexa.CreateStateHandler(states.NAMEMODE, {

    'NameIntent': function() {
        var slot = this.event.request.intent.slots.Name.value;
        var playerName = slot;
        this.attributes['playerName'] = playerName;
        this.attributes['goodbyeMessage'] = playerName + this.attributes['goodbyeMessage'] + playerName + " went home to mom to live with her forever.";
        var response = "Right… So your name is " + playerName + ". This is my grandson. He's been your rival since you both were babies. …Erm, what was his name now?";
        this.handler.state = states.RIVALMODE;
        this.emit(':ask', response, response);
        //this.emit(':ask', "Hello " + nodes[1].message, playerName);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpName, helpName);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var askRivalHandlers = Alexa.CreateStateHandler(states.RIVALMODE, {

    'NameIntent': function() {
        var slot = this.event.request.intent.slots.Name.value;
        var response = "";
        if(slot == this.attributes['playerName']) {
            response = "I don't think you two had the same name...Erm, what was his real name now?";
        } else {
            var rivalName = slot;
            this.attributes['rivalName'] = rivalName;
            response = '…Er, was it ' + rivalName + '? Thats right! I remember now! His name is ' + rivalName + '! ' + this.attributes['playerName'] + '! Your own very Pokémon legend is about to unfold! A world of dreams and adventures with Pokémon awaits! Lets go! <break/> You speak with mom and she says: <break/> ...Right. All ' + this.attributes['sex'] + 's leave home someday. It said so on TV. Prof. Oak next door is looking for you. <break/> Are you ready to continue to the lab?';
            this.handler.state = states.MOVEMENTMODE;
        }
        this.emit(':ask', response, response);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpName, helpName);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var askMovementHandlers = Alexa.CreateStateHandler(states.MOVEMENTMODE, {

    'AMAZON.YesIntent': function(){
        var playerName = this.attributes['playerName'];
        var rivalName = this.attributes['rivalName'];
        var movementState = this.attributes['movementState'];
        var response;
        var reprompt;
        var location = this.attributes['location'];
        var bag = this.attributes['bag'];

        //reset any finished battles
        this.attributes['battle'] = null;
        this.attributes['opponent'] = undefined;
        this.attributes['oppParty'] = undefined;
        
        //hard code story lines tied to movement states?
        if(movementState == 0){
            response = "You see your rival in the lab and he says: <break/> What? It's only " + playerName + "? Gramps isn't around. Would you like to continue to the grass to find some pokemon?";
            reprompt = "Would you like to go to the grass or are you just gonna stand there?";
            this.attributes['movementState']++;
        }
        else if(movementState == 1){
            response = "Oak stops you and says, <break/> Hey! Wait! Don't go out! It's unsafe! Wild Pokemon live in tall grass! You need your own Pokemon for your protection. I know! Come with me! <break/> You follow Oak to the lab. <break/> " + rivalName + " says, Gramps! I'm fed up with waiting! <break/> Oak responds, " + rivalName + "? Let me think… Oh, that's right, I told you to come! Here, " + playerName + "! There are three Pokémon here. Haha! The Pokémon are held inside these Pokéballs. You can have one. Go on, choose! " + rivalName + " blurts, Hey! Gramps! No fair! What about me? Oak retorts, Be patient " + rivalName + "! Do you choose Bulbasaur, the grass Pokemon, Charmander, the fire Pokemon, or Squirtle, the water Pokemon?";
            reprompt = "Come on, choose a Pokemon already.";
            this.handler.state = states.CHOOSEPOKEMONMODE;
            this.attributes['movementState']++;
        }
        else if(movementState >= 2){
            //within a movementState, the player should be able to say YES to continue to next Alexa State, or no (or something else) to stay within the movementState and MOVEMENTMODE
            var randAction = helper.randomAction(location);
            if(randAction == "trainer"){
                this.attributes['battle'] = "trainer"; //can also be "trainer" for trainer battle, or "wild" for wild battle
                this.attributes['opponent'] = helper.generateOT();
                this.attributes['oppParty'] = helper.generateParty(this.attributes['opponent']);
                this.handler.state = states.BATTLEMODE;
            } else if (randAction == "wild"){
                this.attributes['battle'] = "wild"; //can also be "trainer" for trainer battle, or "wild" for wild battle
                this.attributes['opponent'] = "wild";
                this.attributes['oppParty'] = helper.generateRandomPoke(location);
                this.handler.state = states.BATTLEMODE;
            } else if (randAction == "item"){
                //get item
                var findableItems = location.items;
                var foundItem = findableItems[helper.generateRandomInt(0, findableItmes.length-1)];
                this.attributes['bag'][foundItem].count++;
                response = "You found a " + foundItem + "! You put it in your bag for safekeeping. Would you like to continue forward? Or you can say train to stay here and train. ";
            } else {
                this.attributes['location'] = locations[location.next];
                location = locations[location.next];
                response = "You did not encounter any Pokemon and safely made it to " + location.name + ". ";
                if(location.type == "city") {
                    response += helper.getCityActivities(location);
                    this.handler.state = states.CITYMODE;
                } else {
                    response += "Would you like to continue? Or you can say train to stay here and train. ";
                }
            }
            
            this.attributes['movementState']++;
        }
        
        this.emit(':ask', response, reprompt);
    },
    'BagIntent': function () {
        var bag = this.attributes['bag'];
        var response = "";
        var empty = true;
        for(var item in bag){
            if(item.count > 0){
                empty = false;
                break;
            }
        }
        if(empty) {
            response = "Your bag is empty! Please choose another action.";
            this.emit(':ask', response, response);
        } else {
            var items;
            for(var item in bag){
                items += item.name + ", ";
            }
            response = "What would you like to use in your bag? You have the following items: " + items;
            response += ". Please say it in the form of 'use item on pokemon'.";
            //go to bag mode maybe
            this.attributes['prevState'] = this.handler.state;
            this.handler.state = states.BAGMODE;
            this.emit(':ask', response, response);
        }
    },
    'TrainIntent': function () {
        var response;
        var location = this.attributes['location'];
        var bag = this.attributes['bag'];
        if(this.attributes['movementState'] < 2){
            response = "You don't have any Pokemon to train! Say continue instead.";
            this.emit(':ask', response, response);
        }
        
        var randAction = helper.randomAction(location);
        if(randAction == "trainer"){
            this.attributes['battle'] = "trainer"; //can also be "trainer" for trainer battle, or "wild" for wild battle
            this.attributes['opponent'] = helper.generateOT();
            this.attributes['oppParty'] = helper.generateParty(this.attributes['opponent']);
            this.handler.state = states.BATTLEMODE;
        } else if (randAction == "wild"){
            this.attributes['battle'] = "wild"; //can also be "trainer" for trainer battle, or "wild" for wild battle
            this.attributes['opponent'] = "wild";
            this.attributes['oppParty'] = helper.generateRandomPoke(location);
            this.handler.state = states.BATTLEMODE;
        } else if (randAction == "item"){
            //get item
            var findableItems = location.items;
            var foundItem = findableItems[helper.generateRandomInt(0, findableItmes.length-1)];
            this.attributes['bag'][foundItem].count++;
            response = "You found a " + foundItem + "! You put it in your bag for safekeeping. Would you like to continue forward? Or you can say train to stay here and train. ";
        } else {
            response = "Nothing happened! Say train to keep training, or continue to go to the next area";
        }
        this.emit(':ask', response, response);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMovement, helpMovement);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var askPokemonHandlers = Alexa.CreateStateHandler(states.CHOOSEPOKEMONMODE, {

    'ChoosePokemonIntent': function () {
        var starter = this.event.request.intent.slots.Pokemon.value;
        var playerName = this.attributes['playerName'];
        var response;

        if(starter == "bulbasaur") {
            response = "I see! Bulbasaur is your choice. It's very easy to raise. So, " + playerName + ", you want to go with the grass Pokemon Bulbasaur?";
            this.attributes['starter'] = starter;
        }
        else if(starter == "charmander") {
            response = "Ah! Charmander is your choice. You should raise it patiently. So, " + playerName + ", you're claiming the fire Pokemon Charmander?";
            this.attributes['starter'] = starter;
        }
        else if(starter == "squirtle") {
            response = "Hm! Squirtle is your choice. It's one worth raising. So, " + playerName + ", you've decided on the water Pokemon Squirtle?";
            this.attributes['starter'] = starter;
        }
        else if(starter == "Pikachū") {
            response = "Oh! It's name is Pikachu. It's also known as the electric Mouse. It's usually shy, but can sometimes have an electrifying personality. Shocking isn't it? So, Ash, erm...I mean..." + playerName + ", do you want to be the very best, like no one ever was?";
            this.attributes['starter'] = starter;
        } else {
            this.emit(':ask', unhandledPokemon, unhandledPokemon);
        }
        this.emit(':ask', response, response);
    },
    'AMAZON.YesIntent': function () {
        var rivalStarter;
        var playerName = this.attributes['playerName'];
        var rivalName = this.attributes['rivalName'];

        if(typeof this.attributes['starter'] !== 'undefined'){
            var starter = this.attributes['starter'];
            if(starter == "bulbasaur"){
                rivalStarter = "charmander";
            } else if(starter == "charmander"){
                rivalStarter = "squirtle";
            } else if(starter == "squirtle"){
                rivalStarter = "bulbasaur";
            } else {
                rivalStarter = "eevee";
            }
            starter = helper.generatePokemon(starter, true, playerName);
            rivalStarter = helper.generatePokemon(rivalStarter, true, rivalName);
            
            this.attributes['party'] = [starter];
            this.attributes['battle'] = "first"; //can also be "trainer" for trainer battle, or "wild" for wild battle
            this.attributes['opponent'] = rivalName;
            this.attributes['oppParty'] = [rivalStarter];
            //helper.battleSetup(this, playerName, rivalName, "first", [rivalStarter]);
            
            
            this.handler.state = states.BATTLEMODE;
            this.emit(':ask', "<audio src='https://s3.amazonaws.com/colinmosher/pokemon-caught-48.mp3'/>" + playerName + " received the " + starter.name + " from Professor Oak! Your rival walks over to the " + rivalStarter.name + " and says, I'll take this one then! " + rivalName + " received the " + rivalStarter.name + " from Professor Oak! Oak says, if a wild Pokemon appears, your pokemon can battle it. With it at your side, you should be able to reach the next town. " + rivalName + " stops you and says, Wait, " + playerName + "! Let's check out our Pokemon! Come on, I'll take you on! <audio src='https://s3.amazonaws.com/colinmosher/rival-appears-48.mp3'/>... Rival " + rivalName + " would like to battle! Rival " + rivalName + " sent out " + rivalStarter.name + "! Go! " + starter.name + "! Oak interjects saying, Oh for Pete's sake...So pushy as always. " + rivalName + ". You've never had a Pokemon battle before have you? A Pokemon battle is when Trainers pit their Pokemon against each other. Anyway, you'll learn more from experience. What will "+playerName+" do? You can say either let's fight, switch pokemon, open bag, or run away.", "What will "+playerName+" do? You can say either let's fight, switch pokemon, open bag, or run away.");
            //https://www.dropbox.com/s/8q9teg6m7eyrjgs/rivalappears.mp3
        }
        else {
            this.emit(':ask', "Please choose either Bulbasaur, Squirtle, or Charmander.", "Please choose either Bulbasaur, Squirtle, or Charmander.");
        }
    },
    'AMAZON.NoIntent': function () {
        if(typeof this.attributes['starter'] !== 'undefined'){
            this.attributes['starter'] = undefined;
            this.emit(':ask', "Ok, select a different Pokemon");
        }
        else {
            this.emit(':ask', "Please choose your Pokemon");
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpChoosePokemon, helpChoosePokemon);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledPokemon, unhandledPokemon);
    }
});

var battleHandlers = Alexa.CreateStateHandler(states.BATTLEMODE, {

    'FightIntent': function () {
        var playerName = this.attributes['playerName'];

        var poke = this.attributes['party'][0];
        var moves = poke.learnset;
        var moveString = moves.map(function(move){return move.name;}).join(", ");

        var response = "Your " + poke.name + " knows " + moveString + ". Please select one of these moves by saying the word 'use' and the name of the move!";

        this.handler.state = states.CHOOSEMOVEMODE;
        this.emit(':ask', response, response);

    },
    'SwitchPokemonIntent': function() {
        var healthy;
        var healthyArr;
        var response;
        var party = this.attributes['party'];
        var switchIn;

        // create healthy pokemon subarray
        healthyArr = helper.getHealthyParty(party);
        healthy = healthyArr.join(" ");
        if(healthyArr.length > 1) {
            response = "You have the following healthy Pokemon: " + healthy + ". Which healthy Pokemon would you like to use? Please say it in the form of 'switch Pikachu' for example.";
            this.emit(':ask', response, response);
        } else if(healthyArr.length == 1) {
            response = "You don't have any other healthy Pokemon! Please choose let's fight, open bag, or run away.";
            this.emit(':ask', response, response);
        }
    },
    'BagIntent': function () {
        var bag = this.attributes['bag'];
        var response = "";
        var empty = true;
        for(var item in bag){
            if(item.count > 0){
                empty = false;
                break;
            }
        }
        if(empty) {
            response = "Your bag is empty! Please choose another action.";
            this.emit(':ask', response, response);
        } else {
            var items;
            for(var item in bag){
                items += item.name + ", ";
            }
            response = "What would you like to use in your bag? You have the following items: " + items;
            response += ". Please say it in the form of 'use item on pokemon'.";
            //go to bag mode maybe
            //this.attributes['prevState'] = this.handler.state;
            this.handler.state = states.BAGMODE;
            this.emit(':ask', response, response);
        }
    },

    'RunIntent': function () {
        var response;
        if(this.attributes['battle'] != "wild"){
            response = "Can't run away from enemy battle! Please choose let's fight, open bag, or switch Pokemon.";
        } else {
            response = "Ran away safely! Would you like to continue? Or say train to keep training.";
            this.handler.state = states.MOVEMENTMODE;
        }
        this.emit(':ask', response, response);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpBattle, helpBattle);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var chooseMoveHandlers = Alexa.CreateStateHandler(states.CHOOSEMOVEMODE, {

    'ChooseMoveIntent': function () {
        var party = this.attributes['party'];
        var oppParty = this.attributes['oppParty'];
        var healthyArr;
        var oppHealthyArr;
        var poke = party[0];
        var playerName = this.attributes['playerName'];
        var opp = oppParty[0];
        var oppName = this.attributes['opponent'];
        var chosenMove = this.event.request.intent.slots.Move.value;
        chosenMove = chosenMove.replace(/\s+/g, "").toLowerCase();
        var moveset = poke.learnset;
        var oppMove = opp.learnset[helper.generateRandomInt(0,opp.learnset.length-1)];
        var response = "";
        var pokeDmg; //how much damage TO player poke
        var oppDmg; //how much damage TO opp poke
        var crit;
        var moveIndex;
        var location = this.attributes['location'];

        //Need to check if player must use struggle because out of PP on all moves
        moveIndex = helper.hasMove(poke, chosenMove, moveset);
        if(moveIndex > -1){
            //move is in moveset
            var move = moveset[moveIndex];
            if(move.pp > 0){
                //need to see who is faster
                if(poke.stats.speed > opp.stats.speed) {
                    //playerFirst();
                    response += helper.attack(poke, opp, move);
                    var faintRes = helper.isFainted(playerName, oppName, party, oppParty, opp, false);
                    response += faintRes.response;
                    this.attributes['money'] += faintRes.money;
                    this.handler.state = faintRes.state;
                    if(!faintRes.fainted){
                        response += helper.attack(opp, poke, oppMove);
                        faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, true);
                        this.handler.state = faintRes.state;
                        response += faintRes.response;
                    }
                } else if(poke.stats.speed < opp.stats.speed) {
                    //playerSecond();
                    response += helper.attack(opp, poke, oppMove);
                    var faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, false);
                    response += faintRes.response;
                    this.handler.state = faintRes.state;
                    if(!faintRes.fainted){
                        response += helper.attack(poke, opp, move);
                        faintRes = helper.isFainted(playerName, oppName, party, oppParty, opp, true);
                        this.handler.state = faintRes.state;
                        response += faintRes.response;
                    }
                } else if(Math.random() < 0.5) {
                    //randomly choose who goes first
                    //playerFirst();
                    response += helper.attack(poke, opp, move);
                    var faintRes = helper.isFainted(playerName, oppName, party, oppParty, opp, false);
                    response += faintRes.response;
                    this.handler.state = faintRes.state;
                    if(!faintRes.fainted){
                        response += helper.attack(opp, poke, oppMove);
                        faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, true);
                        this.handler.state = faintRes.state;
                        response += faintRes.response;
                    }
                } else {
                    //playerSecond();
                    response += helper.attack(opp, poke, oppMove);
                    var faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, false);
                    response += faintRes.response;
                    this.handler.state = faintRes.state;
                    if(!faintRes.fainted){
                        response += helper.attack(poke, opp, move);
                        faintRes = helper.isFainted(playerName, oppName, party, oppParty, opp, true);
                        this.handler.state = faintRes.state;
                        response += faintRes.response;
                    }
                }
            } else {
                //move is out of PP
                response += "That move is out of PP, please select a different move.";
            }
        } else {
            //move is not in moveset
            response = "That is not an available move. Please choose a different move.";
        }
        //if state is not BATTLEMODE, then need to reset battle (or reset battle in following modes?)
        if(this.handler.state == states.CITYMODE){
            response += helper.getCityActivities(location);
        }
        this.emit(':ask', response, response);
    },
    'GoBackIntent': function () {
        var response = "Ok. Say let's fight, switch pokemon, open bag, or run away.";
        this.handler.state = states.BATTLEMODE;
        this.emit(':ask', response, response);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var switchPokeHandlers = Alexa.CreateStateHandler(states.SWITCHPOKEMODE, {

    'SwitchPokemonIntent': function () {
        var healthy;
        var healthyArr;
        var response = "";
        var party = this.attributes['party'];
        var playerName = this.attributes['playerName'];
        var switchInName;
//        var switchIn;
        var pokeIndex;
        var poke;
        var oppParty = this.attributes['oppParty'];
        var opp = oppParty[0];
        var oppMove = opp.learnset[helper.generateRandomInt(0,3)];

        healthyArr = helper.getHealthyParty(party);

        // need to make sure a name is said...
        switchInName = this.event.request.intent.slots.Pokemon.value;

        for(pokeIndex = 0; pokeIndex < party.length; pokeIndex++){
            if(party[pokeIndex].name == switchInName){
                break;
            }
        }
//        switchIn = party[switchInName];

        helper.switchPokemon(party, 0, pokeIndex);
        //need to say pokemon switched, trainer switched out party[pokeIndex] for part[0]
        response += playerName + " took out " + party[pokeIndex].name + ", and put in " + party[0].name + ". ";
        //switchPokemon: function(party, p1, p2) p1 and p2 are indeces
        poke = party[0];

        //opponent attacks
        response += helper.attack(opp, poke, oppMove);

        //check if faint
        response += helper.isFainted(playerName, null, party, oppParty, poke, true).response;

        this.emit(':ask', response, response);


    },
    'GoBackIntent': function () {
        var response = "Ok. Say let's fight, switch pokemon, open bag, or run away.";
        this.handler.state = states.BATTLEMODE;
        this.emit(':ask', response, response);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var bagHandlers = Alexa.CreateStateHandler(states.BAGMODE, {

    'UseItemIntent': function () {
        var response = "";
        var item = this.event.request.intent.slots.Item.value;
        var poke = this.event.request.intent.slots.Pokemon.value;
        var playerName = this.attributes['playerName'];
        var oppParty = this.attributes['oppParty'];
        var opp = oppParty[0];
        var oppName = this.attributes['opponent']; 
        var party = this.attributes['party'];
        var pokeIndex;
        var hasPoke = false;
        var gym = false;
        
        // need to check if Pokemon is defined, not always necessary
        if(typeof poke === 'undefined'){
            poke = party[0];
        } else {
            for(pokeIndex = 0; pokeIndex < party.length; pokeIndex++){
                if(party[pokeIndex].name == poke){
                    hasPoke = true;
                    return;
                }
            }
        }
        var poke = party[pokeIndex];
        
        if(this.attributes['battle'] == "gym"){
            gym = true;
        }
        
        //need to check if this item exists
        if(typeof itmes[item] == "undefined"){
            response += "That is not a valid item. Please repeat your choice.";
            this.emit(':ask', response, response);
        } else {
            item = items[item];
        }
        //need to check if pokemon is in the party
        if(!hasPoke){
            response += "That is not a valid Pokemon. Please repeat your choice.";
            this.emit(':ask', response, response);
        }
        if(item.count < 1){
            response += "You do not have any of this item left! Please say another item.";
            this.emit(':ask', response, response);
        }
        
        response += playerName + " used " + item.name + "! "

        if(this.attributes['battle'] == null) {
            //we are in peaceful state
            //use item, can't use ball though
            if(item.type == 'ball'){
                response += "Can't use a Pokieball here! Please select a different item or go back.";
            } else if (item.type == 'healing'){
                item.count--;
                poke.hp = Math.min(poke.hp+item.hp, helper.getMaxHp(poke));
            } else if (item.type == 'restore'){
                item.count--;
                poke.hp = Math.min(poke.hp+item.hp, helper.getMaxHp(poke));
                poke.status = null;
            }
            this.handler.state = this.attributes['prevState'];
            this.attributes['prevState'] = null;
        } else if(item.type == "ball"){
            if(this.attributes['battle'] == "wild" && opp != null) {
                item.count--;
                //do the pokeball stuff here
                var hpMax = helper.getMaxHp(opp);
                var hpCurr = opp.hp;
                var rate = opp.catchrate;
                var bonusBall = item.catchrate;
                var bonusStatus = helper.getStatusMult(opp);
                var a = ((3 * hpMax - 2 * hpCurr) * rate * bonusBall * bonusStatus)/(3 * hpMax);
                var b = Math.floor(1048560 / Math.floor(Math.sqrt(Math.floor(Math.sqrt(Math.floor(16711680/a))))));
                
                var rand;
                var shake;
                for(shake = 0; shake<4;shake++){
                    rand = helper.generateRandomInt(0, 65535);
                    if(b >= rand){
                        break;
                    }
                    //play pokeball shake sound effect!
                    response += shake < 4 ? "<audio src='https://s3.amazonaws.com/colinmosher/pokeball-shake-48.mp3'/><break time='1s'/>" : "<break time='1s'/><audio src='https://s3.amazonaws.com/colinmosher/pokemon-caught-48.mp3'/>";
                }
                if(a >= 255 || shake == 4){
                    //pokemon is caught
                    response += "Gotcha! " + opp.name + " was caught!";
                    //if party is full, add to PC, else add to party
                } else {
                    //pokemon was not caught
                    //switch between different responses like "argh so close!"
                    switch(shake){
                        case 0:
                            response += "Oh, no! The Pokemon broke free!";
                            break;
                        case 1:
                            response += "Aww! It appeared to be caught!";
                            break;
                        case 2:
                            response += "Aargh! Almost had it!";
                            break;
                        case 3:
                            response += "Shoot! It was so close too!";
                            break;
                    }
                    //wild poke attacks
                    var oppMove = opp.learnset[helper.generateRandomInt(0,opp.learnset.length-1)];
                    response += helper.attack(opp, poke, oppMove);
                    var faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, true, gym);
                    this.handler.state = faintRes.state;
                    response += faintRes.response;
                }
                
            } else {
                response = "You can't use a Pokéball on an trainer Pokemon! Please chose another item or go back!";
            }
        } else {
            item.count--;
            //use item first
            if (item.type == 'healing'){
                poke.hp = Math.min(poke.hp+item.hp, helper.getMaxHp(poke));
            } else if (item.type == 'restore'){
                poke.hp = Math.min(poke.hp+item.hp, helper.getMaxHp(poke));
                poke.status = null;
            }
            
            //opponent attacks
            var oppMove = opp.learnset[helper.generateRandomInt(0,opp.learnset.length-1)];
            response += helper.attack(opp, poke, oppMove);
            var faintRes = helper.isFainted(playerName, oppName, party, oppParty, poke, true, gym);
            this.handler.state = faintRes.state;
            response += faintRes.response;
            
            
        }
        this.emit(':ask', response, response);
    },
    'GoBackIntent': function () {
        var response;
        var prevState = this.attributes['prevState'];
        if(prevState == null){
            response = "What would you like to do next? Please say let's fight, switch Pokemon, open bag, or run away.";
            this.handler.state = states.BATTLEMODE;
        } else {
            this.handler.state = prevState;
            if(prevState == '_POKECENTERMODE'){
                response = "Welcome to the Pokemon Center! Would you like me to heal your Pokemon back to perfect health?";
            } else if(prevState == '_POKEMARTMODE'){
                response = "Welcome to the Pokemon Mart! Would you like to purchase something today? You can ask me what do I have, or how much money you have, or just tell me what you'd like to buy!";
            } else if(prevState == '_CITYMODE'){
                response = "You close your bag and look at the city. " + helper.getCityActivities(this.attributes['location']);
            } else if(prevState == '_MOVEMENTMODE'){
                //add stuff here
            }
            this.attributes['prevState'] = null;
        }
        this.emit(':ask', response, response);

    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var whiteOutHandlers = Alexa.CreateStateHandler(states.WHITEOUTMODE, {

    'AMAZON.YesIntent': function () {
        var playerName = this.attributes['playerName'];
        var party = this.attributes['party'];
        var rivalName = this.attributes['rivalName'];
        var rivalStarter = this.attributes['oppParty'][0];
        var response;

        //heal party because whited out


        if(this.attributes['movementState'] <= 2){
            this.attributes['battle'] = null;
            this.attributes['opponent'] = undefined;
            this.attributes['oppParty'] = undefined;
            response = rivalName + " says, Yeah! Am I great or what! Oak says, hmm...how disappointing...If you win, you earn prize money, and your Pokemon grow. But if you lose, " + playerName + ", you end up paying prize money...However since you had no warning this time, I'll pay for you. But things won't be this way once you step out these doors. That's why you must strengthen your Pokemon by battling wild Pokemon. Your rival says, ok I'll make my Pokemon battle to toughen it up! " + playerName + "! Gramps! Smell ya later! What would you like to do now? Would you like to go to Route 1?";
            helper.healTeam(party);
            this.handler.state = states.MOVEMENTMODE;
        } else {
            //end up back at pokemon center
            //battle is over
            this.attributes['battle'] = null;
            this.attributes['opponent'] = undefined;
            this.attributes['oppParty'] = undefined;
            
            this.handler.state = states.POKECENTERMODE;
            this.attributes['location'] = this.attributes['lastVisitedCity'];
            response = "You were transported back to " + this.attributes['lastVisitedCity'].name + ". Welcome to the Pokemon Center! Would you like me to heal your Pokemon back to perfect health?";
        }
        this.emit(':ask', response, response);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var pokeCenterHandlers = Alexa.CreateStateHandler(states.POKECENTERMODE, {

    'AMAZON.YesIntent': function () {
        var playerName = this.attributes['playerName'];
        var party = this.attributes['party'];
        var rivalName = this.attributes['rivalName'];
        var rivalStarter = this.attributes['oppParty'][0];
        this.attributes['lastVisitedCity'] = this.attributes['location'];
        var response = "Okay, I'll take your Pokemon for a few seconds. <audio src='https://s3.amazonaws.com/colinmosher/pokecenter.mp3'/> Thank you for waiting. We've restored your Pokemon to full health. We hope to see you again! Where would you like to go now? You can say go back to the city, leave, open the PC, or heal your pokemon again.";
        helper.healTeam(party);

        this.emit(':ask', response, response);
    },
    'AMAZON.NoIntent': function () {
        var response = "We hope to see you again! Where would you like to go now? You can say go back to the city, leave, open the PC, or heal your pokemon again.";
        this.emit(':ask', response, response);
    },
    'HealIntent': function () {
        var response = "Welcome to the Pokemon Center! Would you like me to heal your Pokemon back to perfect health?";
        this.emit(':ask', response, response);
    },
    'LeaveIntent': function () {
        var currCity = this.attributes['location'];
        var response = "We hope to see you again! You leave the PokieCenter and now you're back in " + currCity + ". ";
        response += helper.getCityActivities(currCity);
        this.handler.state = states.CITYMODE;
        this.emit(':ask', response, response);
    },
    'BagIntent': function () {
        var bag = this.attributes['bag'];
        var response = "";
        var empty = true;
        for(var item in bag){
            if(item.count > 0){
                empty = false;
                break;
            }
        }
        if(empty) {
            response = "Your bag is empty! Please choose another action.";
            this.emit(':ask', response, response);
        } else {
            var items;
            for(var item in bag){
                items += item.name + ", ";
            }
            response = "What would you like to use in your bag? You have the following items: " + items;
            response += ". Please say it in the form of 'use item on pokemon'.";
            //go to bag mode maybe
            this.attributes['prevState'] = this.handler.state;
            this.handler.state = states.BAGMODE;
            this.emit(':ask', response, response);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var pokeMartHandlers = Alexa.CreateStateHandler(states.POKEMARTMODE, {

    'MoneyIntent': function () {
        var money = this.attributes['money'];
        var response = "You have " + money + " PokieDollars. ";
        if(money < 1000) {
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
        this.emit(':ask', response, response);
    },
    'AskItemsIntent': function () {
        var response = "I have the following items: "
        var itemNames = Object.keys(items);
        var response = "";
        for(var itemIndex = 0; itemIndex < itemNames.length-1; itemIndex++) {
            response += itemNames[itemIndex] + "s, ";
        }
        response += "and " + itemNames[itemNames.length-1] + "s. What would you like to buy?";
        this.emit(':ask', response, response);
    },
    'PurchaseIntent': function () {
        var item = this.event.request.intent.slots.Item.value;
        item = item.replace(/\s+/g, "").toLowerCase();
        this.attributes['chosenItem'] = {
            item: item,
            num: 0
        };
        var response = "You selected " + item + ", which costs " + items[item].price + " each. How many would you like to buy?";

        this.emit(':ask', response, response);
    },
    'ChooseNumberIntent': function () {
        var num = this.event.request.intent.slots.Number.value;
        var money = this.attributes['money'];
        var item = this.attributes['chosenItem'];
        var response;

        if (item == null) {
            response = "You have not chosen an item yet! Please ask me how much money you have, what items I have, or just tell me what you'd like to buy. Or you can leave!";
        } else {
            this.attributes['chosenItem'].num = num;
            item = this.attributes['chosenItem'].item;

            response = num + " " + item;
            response += num > 1 ? "s " : " ";
            response += "will cost you " + (items[item].price*num) + " PokieDollars. ";
            if(items[item].price*num > money) {
                response += "You do not have enough money! Please select a different amount or item";
            } else {
                response += "Please say yes to confirm your order!";
            }
        }

        this.emit(':ask', response, response);

    },
    'AMAZON.YesIntent': function () {
        var item = this.attributes['chosenItem'];
        var money = this.attributes['money'];
        var bag = this.attributes['bag'];
        var response;
        if (item == null) {
            response = "You have not chosen an item yet! Please ask me how much money you have, what items I have, or just tell me what you'd like to buy. Or you can leave!";
        } else if (items[item].price*num > money) {
            money -= items[item].price*num;
            bag[item].count++;
            //Need to somehow take into account how many??????
            response = "Thank you for your purchase! What would you like to do next? You can purchase a new item, or you can ask to leave";
            this.attributes['chosenItem'] = null;
        }

        this.emit(':ask', response, response);

    },
    'LeaveIntent': function () {
        var currCity = this.attributes['location'];
        var response = "Goodbye! You leave the PokieMart and now you're back in " + currCity + ". ";
        response += helper.getCityActivities(currCity);
        this.handler.state = states.CITYMODE;
        this.emit(':ask', response, response);
    },
    'BagIntent': function () {
        var bag = this.attributes['bag'];
        var response = "";
        var empty = true;
        for(var item in bag){
            if(item.count > 0){
                empty = false;
                break;
            }
        }
        if(empty) {
            response = "Your bag is empty! Please choose another action.";
            this.emit(':ask', response, response);
        } else {
            var items;
            for(var item in bag){
                items += item.name + ", ";
            }
            response = "What would you like to use in your bag? You have the following items: " + items;
            response += ". Please say it in the form of 'use item on pokemon'.";
            //go to bag mode maybe
            this.attributes['prevState'] = this.handler.state;
            this.handler.state = states.BAGMODE;
            this.emit(':ask', response, response);
        }
    },
    'AMAZON.NoIntent': function () {
        var response = "Ok, I have canceled the order. You can ask me how much money you have, what items I have, or just tell me what you'd like to buy. Or you can leave!";
        this.attributes['chosenItem'] = null;
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

var cityHandlers = Alexa.CreateStateHandler(states.CITYMODE, {

    'PokeCenterIntent': function () {
        this.handler.state = states.POKECENTERMODE;
        var response = "Welcome to the Pokemon Center! Would you like me to heal your Pokemon back to perfect health?";
        this.emit(':ask', response, response);
    },
    'PokeMartIntent': function () {
        this.handler.state = states.POKEMARTMODE;
        var response = "Welcome to the Pokemon Mart! Would you like to purchase something today? You can ask me what do I have, or how much money you have, or just tell me what you'd like to buy!";
        this.emit(':ask', response, response);
    },
    'BagIntent': function () {
        var bag = this.attributes['bag'];
        var response = "";
        if(bag.length == 0) {
            response = "Your bag is empty! Please choose another action.";
            this.emit(':ask', response, response);
        } else {
            var items;
            for(var i = 0; i<bag.length; i++){
                items += bag[i] + ", ";
            }
            response = "What would you like to use in your bag? You have the following items: " + items;
            response += "Please say it in the form of 'use item on pokemon'";
            //go to bag mode maybe
            this.attributes['prevState'] = this.handler.state;
            this.handler.state = states.BAGMODE;
            this.emit(':ask', response, response);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});


var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.attributes['goodbyeMessage']);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'BicycleIntent': function () {
        this.emit(':ask', bicycleMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', unhandledGeneral, unhandledGeneral);
    }
});

// --------------- Helper Functions  -----------------------

var helper = {

    addExperience: function(poke, opp) {
        var a = opp.wild == true ? 1 : 1.5;
        var base = Pokemon[poke.name].base;
        var b = Pokemon[poke.name].baseExp;
        var L = opp.level;
        var exp = Math.floor(a*b*L/(7));
        poke.exp = +poke.exp+exp;
        var leveledUp = helper.checkLevelUp(poke)
        return [exp, leveledUp];
    },
    attack: function(poke, opp, move){
        var response = "";
        var damage;
        var crit;
        var acc;
        response += poke.OT + "'s " + poke.name + " used " + move.name + "! ";
        if(move.cat == "physical" || move.cat == "special"){
            crit = helper.calcCrit();
            damage = helper.calcDamage(poke, opp, move, crit);
            if(damage > -1){
                response += (crit == 2 && helper.calcEffectivity(move, opp) > 0) ? "A critical hit! " : "";
                response += helper.getEffectivity(helper.calcEffectivity(move, opp));
                response += poke.OT + "'s " + poke.name + " did " + damage + " H P of damage to " + opp.OT + "'s " + opp.name + ". ";
            } else {
                //attack missed
                response += poke.name + "'s attack missed! ";
            }
        } else {
            response += helper.calcStatusEffect(poke, opp, move);
        }
        for(var moveIndex = 0; moveIndex < poke.learnset.length; moveIndex++){
            if(poke.learnset[moveIndex].name == move.name){
                poke.learnset[moveIndex].pp--;
                break;
            }
        }
        return response;
    },
    battleSetup: function(context, player, opponent, battleType, oppParty) {
//        context.attributes['battle'] = battleType;
//        context.attributes['opponent'] = opponent;
//        context.attributes['oppParty'] = oppParty; //need to generateParty(...) if not defined
    },
    calcCrit: function() {
        return Math.random() <= .0625 ? 2 : 1;
    },
    //poke is attacker, opp is defender, move is move object
    calcDamage: function(poke, opp, move, crit) {
        var modifier = crit * helper.calcRandDamage() * helper.calcSTAB(poke, move) * helper.calcEffectivity(move, opp);
        if(move.cat != "status"){
            var rand = Math.random()*100;
            if(rand < move.acc*modifiers[poke.modifiers.acc]){
                //move hits
                var atk = move.cat == "physical" ? poke.stats.atk : poke.stats.spatk;
                var def = move.cat == "physical" ? opp.stats.def : opp.stats.spdef;
                var damage = Math.floor(((2*poke.level/5+2)*move.power*atk/def*(1/50)+2) * modifier);
                opp.hp -= Math.max(1, damage);
                return Math.max(1, damage);
            } else {
                //move misses
                return -1;
            }
        }
    },
    calcEffectivity: function(move, opp){
        var mult = 1;
        opp.types.forEach(function(type){
            if(type != ""){
                mult *= typeChart[move.type][type];
            }
        });
        return mult;
    },
    calcRandDamage: function() {
        return 1 - Math.random()*.15;
    },
    calcSTAB: function(poke, move) {
        return (move.type == poke.types[0] || move.type == poke.types[1]) ? 1.5 : 1;
    },
    calcStatusEffect: function(poke, opp, move) {
        if (typeof Object.keys(move.modifier) !== 'undefined' && Object.keys(move.modifier).length > 0) {
            var stat = Object.keys(move.modifier)[1];
        }
        var response;
        if(move.modifier.self){
            if(poke.modifiers[stat] < 6 || poke.modifiers[stat] > -6){
                poke.modifiers[stat] += move.modifier[stat];
                poke.stats[stat] = modifiers[poke.modifiers[stat]] * Math.floor((Math.floor((2*Pokemon[poke.name].base[stat]+poke.IVs[stat]+Math.floor(poke.EVs/4))*poke.level)/100)+5);
                response = helper.getStatusEffect(poke, stat, move.modifier);
            } else if(poke.modifiers[stat] >= 6) {
                response = poke.name + "'s " + stat + " won't go higher! ";
            } else if(poke.modifiers[stat] <= -6) {
                response = poke.name + "'s " + stat + " won't go lower! ";
            }
        } else {
            if(opp.modifiers[stat] < 6 || opp.modifiers[stat] > -6){
                opp.modifiers[stat] += move.modifier[stat];
                opp.stats[stat] = modifiers[opp.modifiers[stat]] * Math.floor((Math.floor((2*Pokemon[opp.name].base[stat]+opp.IVs[stat]+Math.floor(opp.EVs/4))*opp.level)/100)+5);
                response = helper.getStatusEffect(opp, stat, move.modifier)
            } else if(opp.modifiers[stat] >= 6) {
                response = opp.name + "'s " + stat + " won't go higher! ";
            } else if(opp.modifiers[stat] <= -6) {
                response = opp.name + "'s " + stat + " won't go lower! ";
            }
        }
        //should return string?
        return response;
    },
    checkLevelUp: function(poke) {
        var levelUp = false;
        var level = Math.floor(helper.nthroot(poke.exp, 3));
        if(level > poke.level){
            poke.level++;
            levelUp = true;
        }
        return levelUp;
    },
    endBattle: function(party){
        //don't reset health
        //don't reset pp
        var moneyMult = 0;
        //reset stat modifiers and stats for each pokemon
        party.forEach(function(poke) {
            helper.resetStats(poke);
            moneyMult += poke.level;
        });
        //reset battle setup for opponent

        //add money!
        var money = Math.round(Math.random() * 25 * moneyMult + 30 * moneyMult);


        return money;
    },
    generateParty: function(OT){
        var size = helper.generateRandomInt(1,6);
        var party = []
        for(var i = 1; i <= size; i++){
            //should probably generate pokemon not completely randomly
            //generated party should only generate pokemon that can be at that level (ie current level less than evolution's level)
            var randPoke = helper.generatePokemon(pokedex[helper.generateRandomInt(0, pokedex.length-1)], false, OT);
            party.push(randPoke);
        }
    },
    //name is official name of pokemon, starter is boolean true if pokemon is a starter (level 5) wild is boolean for wild (true) or not (false)
    generatePokemon: function(name, starter, OT) {
        var poke = {
            'name': name,
            'OT': OT,
            'types': Pokemon[name].types,
            'IVs': {
                'hp': helper.generateRandomInt(0,31),
                'spdef': helper.generateRandomInt(0,31),
                'spatk': helper.generateRandomInt(0,31),
                'def': helper.generateRandomInt(0,31),
                'atk': helper.generateRandomInt(0,31),
                'speed': helper.generateRandomInt(0,31)
            },
            'modifiers':{
                'hp': 0,
                'spdef': 0,
                'spatk': 0,
                'def': 0,
                'atk': 0,
                'speed': 0,
                'acc': 0
            },
            'stats':{
            },
            'EVs': 0,
            'status': null
        }

        poke.level = starter ? 5 : helper.generateRandomInt(Math.max(this.attributes['movementState']*2/3-2, 1), Math.min(this.attributes['movementState']*2/3+2, 100));

        poke.exp = Math.pow(poke.level, 3);
        poke.hp = Math.floor((2*Pokemon[name].base.hp+poke.IVs.hp+Math.floor(poke.EVs/4))*poke.level/100)+poke.level+10;

        poke.learnset = [];
        for(move in Pokemon[name].learnset){
            if(move <= poke.level){
                poke.learnset.push(Pokemon[name].learnset[move]);
            }
        }
        if(Object.keys(poke.learnset).length > 4){
            poke.learnset = helper.getRandomSubarray(poke.learnset, 4);
        }
        function returnStat(stat) {
            stat = Math.floor(Math.floor((2*Pokemon[name].base[stat]+poke.IVs[stat]+Math.floor(poke.EVs/4))*poke.level/100)+5);
            return stat;
        }
        poke.stats.spdef = returnStat('spdef');
        poke.stats.spatk = returnStat('spatk');
        poke.stats.def = returnStat('def');
        poke.stats.atk = returnStat('atk');
        poke.stats.speed = returnStat('speed');

        return poke;
    },
    generateRandomInt: function(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min+1)) + min;
    },
    generateRandomPoke: function(location) {
        var pokeOnRoute = Object.keys(location.pokemon);
        var rand = Math.random()*100;
        var comparison = 0;
        pokeOnRoute.forEach(function(poke) {
            comparison += location.pokemon[poke];
            if(rand < comparison){
                return helper.generatePokemon(poke, true, "wild");
            }
        });
    },
    getCityActivities: function (location) {
        var response = "You can ";
        var buildings = location.buildings;
        for(var b = 0; b < buildings.length; b++){
            if(b == 'pokemart'){
                response += "go to the PokieMart,";
            } else if(b == 'pokecenter') {
                response += "go to the PokieCenter,";
            } else if(b == 'gym'){
                response += "go to the gym to battle the leader,";
            }
        }
        response += buildings.length > 0 ? " or " : "";
        response += "go to the next location, " + location.next + ". ";
        return response;
    },
    getEffectivity: function(effectivity) {
        //need to reference type chart
        var string = "";
        switch(effectivity){
            case 0:
                string+= "It had no effect...";
                break;
            case .25:
                string+= "It's extremely ineffective...";
                break;
            case .5:
                string+= "It's not very effective...";
                break;
            case 1:
                string+= "";
                break;
            case 2:
                string+= "It's super effective! ";
                break;
            case 4:
                string+= "It's super duper effective! ";
                break;
        }
        return string;
    },
    getHealthyParty: function(party) {
        var healthyArr = [];
        for(var i = 0; i < party.length; i++){
            if(party[i].hp > 0){
                healthyArr.push(party[i]);
            }
        }
        return healthyArr;
    },
    getMaxHp: function(poke) {
        return Math.floor((2*Pokemon[poke.name].base.hp+poke.IVs.hp+Math.floor(poke.EVs/4))*poke.level/100)+poke.level+10;
    },
    getRandomSubarray: function (arr, size) {
        var shuffled = arr.slice(0), i = arr.length, temp, index;
        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(0, size);
    },
    getStatusEffect: function(poke, stat, modifier){
        var statLong;
        switch(stat){
            case 'atk':
                statLong = 'attack';
                break;
            case 'spatk':
                statLong = 'special attack';
                break;
            case 'def':
                statLong = 'defense';
                break;
            case 'spdef':
                statLong = 'special defense';
                break;
            case 'acc':
                statLong = 'accuracy';
                break;
        }
        var string = poke.name + "'s " + statLong + " ";
        //TODO fix this below
        var mod = "";
        switch(modifier[stat]){
            case -2:
            case "-2":
                mod = "harshly fell! ";
                break;
            case -1:
            case "-1":
                mod = "fell! ";
                break;
            case 1:
            case "1":
                mod = "rose! ";
                break;
            case 2:
            case "2":
                mod = "sharply rose! ";
                break;
        }
        return string + mod;
    },
    getStatusMult: function(poke){
        switch(poke.status){
            case 'sleep':
            case 'freeze':
                return 2;
                break;
            case 'paralyze':
            case 'poison':
            case 'burn':
                return 1.5;
                break;
            default:
                return 1;
                break;
        }
    },
    hasMove: function(poke, chosenMove, moveset) {
        for(var moveIndex = 0; moveIndex < poke.learnset.length; moveIndex++){
            if(chosenMove == moveset[moveIndex].name){
                return moveIndex;
            }
        }
        return -1;
    },
    healTeam: function(party) {;
        party.forEach(function(poke) {
            helper.heal(poke);
        })
    },
    heal: function(poke) {
        poke.hp = Math.floor((2*Pokemon[poke.name].base.hp+poke.IVs.hp+Math.floor(poke.EVs/4))*poke.level/100)+poke.level+10;
        poke.learnset.forEach(function(move) {
            move.pp = attacks[move.name].pp;
        })
        //reset status such as sleep or paralysis
    },
    //checks to see if POKE has fainted, either can own it
    //playerName should always be the Alexa player, oppName should always be opponent's name, etc., but poke is the poke to check if fainted
    isFainted: function(playerName, oppName, party, oppParty, poke, second, gym) {
        var response = "";
        var healthyArr;
        var playerPoke = party[0];
        var opp;
        var explvl;
        var money = 0;
        var fainted = false;
        var state;
        if(typeof gym === 'undefined'){
            gym = false;
        }

        if(poke.hp <= 0){
            fainted = true;
            if(poke.OT == playerName){
                //player needs to switch out pokemon if they have one
                response += "Player's " + poke.name + " has fainted! ";

                healthyArr = helper.getHealthyParty(party);

                if(healthyArr.length === 0) {
                    money = Math.floor(0.333 * helper.endBattle(party));
                    response += playerName + " is out of usable Pokemon! " + playerName + " blacked out! " + playerName + " dropped " + money + " PokieDollars and ran off! Do you still want to continue?";
                    money = -money;
                    state = states.WHITEOUTMODE;
                } else {
                    response += "You have the following Pokemon left: " + healthyArr.join(" ") + ". Please say 'switch' and then the Pokemon's name in order to switch them. ";
                    state = states.SWITCHPOKEMODE;
                }
            } else if(poke.OT == "wild") {
                //wild pokemon fainted and battle is over
                opp = poke;
                explvl = helper.addExperience(playerPoke, opp);
                response += playerName + " defeated wild " + poke.name + "! " + playerPoke.name + " gained " + explvl[0] + " experience. ";
                response += explvl[1] ? playerPoke.name + " went up to level " + playerPoke.level + "! " : "";
                helper.endBattle(party);
                state = states.BATTLEOVERMODE;
            } else {
                //pokemon is owned by trainer, must check to switch out or battle is over
                opp = poke;
                explvl = helper.addExperience(playerPoke, opp);
                response += playerName + " defeated enemy " + poke.name + "! " + playerPoke.name + " gained " + explvl[0] + " experience. ";
                response += explvl[1] ? playerPoke.name + " went up to level " + playerPoke.level + "! " : "";
                var oppHealthyParty = helper.getHealthyParty(oppParty);
                if(oppHealthyParty.length >= 1){
                    //opp has a healthy pokemon left
                    var pokeIndex;
                    for(pokeIndex = 0; pokeIndex < oppParty.length; pokeIndex++){
                        if(oppParty[pokeIndex].hp > 0){
                            break;
                        }
                    }
                    helper.switchPokemon(oppParty, 0, pokeIndex);
                    response += oppParty[0].OT + " sent out " + oppParty[0] + "! ";
                    response += "What would you like to do next? Please say let's fight, switch Pokemon, open bag, or run away.";
                } else {
                    //opp has been defeated
                    money = helper.endBattle(party);
                    response += playerName + " earned " + money + " PokieDollars from " + oppName + ". ";

                    //Trainer should be able to make witty response!


                    state = states.BATTLEOVERMODE;
                }
            }
        } else {
            response += second ? "What would you like to do next? Please say let's fight, switch Pokemon, open bag, or run away." : "";
            state = states.BATTLEMODE;
        }
        if(state == states.BATTLEOVERMODE){
            //if regular trainer, go back to movementmode, if gym battle, go back to city mode, else who knows
            //also add to response!!
            if(gym){
                state = states.CITYMODE;
                response += "You exit the gym and look around the city. ";
            } else {
                state = states.MOVEMENTMODE;
                response += "You start walking along the route again. Would you like to continue to the next area? Or say train to keep training. ";
            }
        }
        return {'fainted': fainted, 'response': response, 'state': state, 'money': money};
    },
    nthroot: function(x, n){
        try {
            var negate = n % 2 == 1 && x < 0;
            if(negate) {
                x = -x;
            }
            var possible = Math.pow(x, 1 / n);
            n = Math.pow(possible, n);
            if(Math.abs(x - n) < 1 && (x > 0 == n > 0)) {
                return negate ? -possible : possible;
            }
        } catch(e){}
    },
    randomAction: function(location) {
        var probNothingHappens = 60;
        var range = location.trainers + location.grass + location.items.length + probNothingHappens;
        var rand = Math.random()*range;
        if(rand < location.trainers){
            return "trainer";
        } else if (rand < location.trainers + location.grass){
            return "wild";
        } else if (rand < location.trainers + location.grass + location.items.length){
            return "item";
        } else {
            return "";
        }
    },
    resetStats: function(poke) {
        poke.hp = Math.floor((2*Pokemon[poke.name].base.hp+poke.IVs.hp+Math.floor(poke.EVs/4))/100)+poke.level+10;
        function returnStat(stat) {
            stat = Math.floor(Math.floor((2*Pokemon[poke.name].base[stat]+poke.IVs[stat]+Math.floor(poke.EVs/4))*poke.level/100)+5);
            return stat;
        }
        poke.stats.spdef = returnStat('spdef');
        poke.stats.spatk = returnStat('spatk');
        poke.stats.def = returnStat('def');
        poke.stats.atk = returnStat('atk');
        poke.stats.speed = returnStat('speed');

        //is this correct?
        for(var mod in poke.modifiers) {
            poke.modifiers[mod] = 0;
        }
    },
    switchPokemon: function(party, p1, p2) {
        //switching by index
        var a = party[p1];
        party[p1] = party[p2];
        party[p2] = a;
    }
}
