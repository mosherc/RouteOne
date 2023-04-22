import { deburr } from 'lodash';
import { DAMAGE_MODIFIERS, DamageModifiers } from './constants/damage-modifiers';
import { ITEMS } from './constants/items';
import { Route, LOCATIONS, Location } from './constants/locations';
import { Move, StatName, ModifierName, AvailableMoves, MOVE_SET } from './constants/move-set';
import { Pokemon, POKEDEX, AVAILABLE_POKEMON, AvailablePokemon } from './constants/pokemon';
import { STATES } from './constants/states';
import { TYPE_CHART } from './constants/type-chart';
import { Sex } from './handlers/HandlerThis';
import { helpBattle } from './constants/messages';

export const helper = {
  addExperience(poke: Pokemon, opp: Pokemon): [number, boolean] {
    const a = opp.OT === 'wild' ? 1 : 1.5;
    const b = poke.baseExp;
    const L = opp.level;
    const exp = Math.floor((a * b * L) / 7);
    poke.experience = +poke.experience + exp;
    const leveledUp = helper.checkLevelUp(poke);
    return [exp, leveledUp];
  },
  attack(poke: Pokemon, opp: Pokemon, move: Move) {
    let response = '';
    response += `${poke.OT}'s ${poke.name} used ${move.name}! `;
    if (move.category === 'PHYSICAL' || move.category === 'SPECIAL') {
      const crit = helper.calcCritMultiplier();
      const prevHp = opp.stats.hp;
      const damage = helper.calcDamage(poke, opp, move, crit);
      if (damage && damage > -1) {
        response += crit === 2 && helper.calcEffectivity(move, opp) > 0 ? 'A critical hit! ' : '';
        response += helper.getEffectivity(helper.calcEffectivity(move, opp));
        response += `${poke.OT}'s ${poke.name} did ${damage} H P of damage to ${opp.OT}'s ${opp.name}. `;
        if (damage < prevHp) {
          const maxHp = helper.getMaxHp(opp);
          const newHp = prevHp - damage;
          const percentHp = Math.floor(newHp / maxHp * 100);
          if (percentHp < 25) {
            response += `${opp.name} only has ${newHp} H P left! `;
          }
        }
      } else if (typeof damage === 'number') {
        // attack missed
        response += `${poke.name}'s attack missed! `;
      }
    } else {
      response += helper.calcStatusEffects(poke, opp, move);
    }
    for (let moveIndex = 0; moveIndex < poke.moveSet.length; moveIndex++) {
      if (poke.moveSet[moveIndex].name === move.name) {
        poke.moveSet[moveIndex].pp--;
        break;
      }
    }
    return response;
  },
  calcCritMultiplier() {
    return Math.random() <= 0.0625 ? 2 : 1;
  },
  // poke is attacker, opp is defender, move is move object
  calcDamage(poke: Pokemon, opp: Pokemon, move: Move, critMultiplier: number) {
    const modifier = critMultiplier * helper.calcRandDamage() * helper.calcSTAB(poke, move) * helper.calcEffectivity(move, opp);
    if (move.category !== 'STATUS') {
      const rand = Math.random() * 100;
      if (rand < move.accuracy * DAMAGE_MODIFIERS[poke.modifiers.acc]) {
        // move hits
        const atk = move.category === 'PHYSICAL' ? poke.stats.atk : poke.stats.spatk;
        const def = move.category === 'PHYSICAL' ? opp.stats.def : opp.stats.spdef;
        const damage = Math.floor((((((2 * poke.level) / 5 + 2) * move.power * atk) / def) * (1 / 50) + 2) * modifier);
        opp.stats.hp -= Math.max(1, damage);
        return Math.max(1, damage);
      }
      // move misses
      return -1;
    }
    return null;
  },
  calcEffectivity(move: Move, poke: Pokemon) {
    let mult = 1;
    poke.types.forEach(function (type) {
      mult *= TYPE_CHART[move.type][type];
    });
    return mult;
  },
  calcRandDamage() {
    return 1 - Math.random() * 0.15;
  },
  calcSTAB(poke: Pokemon, move: Move) {
    return move.type === poke.types[0] || move.type === poke.types[1] ? 1.5 : 1;
  },
  calcStat(poke: Pokemon, stat: StatName) {
    if (stat === 'hp') {
      return Math.floor(((2 * poke.base.hp + poke.individualValues.hp + Math.floor(poke.effortValues.hp / 4)) * poke.level) / 100) + poke.level + 10;
    }
    return Math.floor(Math.floor(((2 * poke.base[stat] + poke.individualValues[stat] + Math.floor(poke.effortValues[stat] / 4)) * poke.level) / 100) + 5);
  },
  calcStatusEffect(poke: Pokemon, stat: StatName, value: DamageModifiers): string {
    let response = '';
    const modifierValue = poke.modifiers[stat];
    if (modifierValue) {
      if (modifierValue < 6 || modifierValue > -6) {
        const newStatValue = Math.min(-6, Math.max(6, value)) as DamageModifiers;
        poke.modifiers[stat] += newStatValue;
        poke.stats[stat] = DAMAGE_MODIFIERS[modifierValue] * helper.calcStat(poke, stat);
        response = helper.getStatusEffect(poke, stat, newStatValue);
      } else if (modifierValue >= 6) {
        response = `${poke.name}'s ${stat} won't go higher! `;
      } else if (modifierValue <= -6) {
        response = `${poke.name}'s ${stat} won't go lower! `;
      }
    }
    return response;
  },
  calcStatusEffects(poke: Pokemon, opp: Pokemon, { modifier }: Move): string {
    // TODO something is wrong here
    // Colin's Pikachū used thundershock! Colin's Pikachū did 6 H P of damage to douche's eevee. douche's eevee used growl! . . . . . . What would you like to do next? Please say let's fight, switch Pokemon, open bag, or run away.
    if (modifier && Object.keys(modifier).length > 0) {
      const modifiedStats = Object.entries(modifier.values);
      const responses = modifiedStats.map(([stat, value]) => helper.calcStatusEffect(modifier.self ? poke : opp, stat as StatName, value));
      return responses.join('. ');
    }
    return '';
  },
  checkBagEmpty: (bag: typeof ITEMS) => {
    return !Object.values(bag).some((item) => item.count > 0);
  },
  checkLevelUp(poke: Pokemon) {
    let levelUp = false;
    const level = Math.floor(helper.nthroot(poke.experience, 3));
    if (level > poke.level) {
      poke.level++;
      levelUp = true;
    }
    return levelUp;
  },
  endBattle(party: Pokemon[]) {
    // don't reset health
    // don't reset pp
    let moneyMult = 0;
    // reset stat modifiers and stats for each pokemon
    party.forEach(function (poke) {
      helper.resetStats(poke);
      moneyMult += poke.level;
    });
    // reset battle setup for opponent

    // add money!
    const money = Math.round(Math.random() * 25 * moneyMult + 30 * moneyMult);

    return money;
  },
  generateOT: () => {
    const names = ['Loser', 'Jerk', 'Joey', 'Silver', 'Red', 'Misty', 'Brock', 'Jesse', 'James', 'Tobey', 'Jennie', 'Jack', 'Jill', 'Marcus'];
    return names[helper.generateRandomInt(0, names.length - 1)];
  },
  generateParty(OT: string, playerParty: Pokemon[]) {
    const size = helper.generateRandomInt(1, 6);
    const party: Pokemon[] = [];
    for (let i = 1; i <= size; i++) {
      // should probably generate pokemon not completely randomly
      // generated party should only generate pokemon that can be at that level (ie current level less than evolution's level)
      const randPoke = helper.generatePokemon(
        AVAILABLE_POKEMON[helper.generateRandomInt(0, AVAILABLE_POKEMON.length - 1)],
        OT,
        helper.generateLevelFromPlayerParty(OT, playerParty),
      );
      party.push(randPoke);
    }
    return party;
  },
  generateLevelFromPlayerParty: (OT: string, playerParty: Pokemon[]): number => {
    const partyLevels = playerParty.map((poke) => poke.level);
    const maxLevel = Math.max(...partyLevels);
    const minLevel = Math.min(...partyLevels);
    const level = OT === 'wild' ? helper.generateRandomInt(minLevel, maxLevel) : helper.generateRandomInt(minLevel, Math.floor(maxLevel * 1.2));
    return level;
  },
  // name is official name of pokemon, starter is boolean true if pokemon is a starter (level 5) wild is boolean for wild (true) or not (false)
  generatePokemon(name: AvailablePokemon, OT: string, level: number) {
    const poke: Pokemon = {
      name: POKEDEX[name].name,
      OT,
      id: POKEDEX[name].id,
      base: POKEDEX[name].base,
      baseExp: POKEDEX[name].baseExp,
      learnSet: POKEDEX[name].learnSet,
      catchRate: POKEDEX[name].catchRate,
      types: POKEDEX[name].types,
      level,
      experience: 0,
      moveSet: [],
      individualValues: {
        hp: helper.generateRandomInt(0, 31),
        spdef: helper.generateRandomInt(0, 31),
        spatk: helper.generateRandomInt(0, 31),
        def: helper.generateRandomInt(0, 31),
        atk: helper.generateRandomInt(0, 31),
        speed: helper.generateRandomInt(0, 31),
      },
      modifiers: {
        hp: 0,
        spdef: 0,
        spatk: 0,
        def: 0,
        atk: 0,
        speed: 0,
        acc: 0,
      },
      stats: {
        hp: 0,
        spdef: 0,
        spatk: 0,
        def: 0,
        atk: 0,
        speed: 0,
      },
      effortValues: {
        hp: 0,
        spdef: 0,
        spatk: 0,
        def: 0,
        atk: 0,
        speed: 0,
      },
      status: null,
    };

    poke.experience = poke.level ** 3; // need to account for different types of experience curves

    Object.entries(POKEDEX[name].learnSet).forEach(([moveLevel, move]) => {
      if (Number(moveLevel) <= poke.level) {
        poke.moveSet.push(move);
      }
    });
    if (poke.moveSet.length > 4) {
      poke.moveSet = helper.getRandomSubarray(poke.moveSet, 4);
    }

    poke.stats.hp = helper.calcStat(poke, 'hp');
    poke.stats.spdef = helper.calcStat(poke, 'spdef');
    poke.stats.spatk = helper.calcStat(poke, 'spatk');
    poke.stats.def = helper.calcStat(poke, 'def');
    poke.stats.atk = helper.calcStat(poke, 'atk');
    poke.stats.speed = helper.calcStat(poke, 'speed');

    return poke;
  },
  generateRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  generateRandomPoke(location: Route, playerParty: Pokemon[]): Pokemon | null {
    const pokeOnRoute = Object.keys(location.pokemon) as unknown as AvailablePokemon[];
    const rand = Math.random() * 100;
    let comparison = 0;
    pokeOnRoute.forEach((poke) => {
      comparison += location.pokemon[poke] ?? 0;
      if (rand < comparison) {
        return helper.generatePokemon(poke, 'wild', helper.generateLevelFromPlayerParty('wild', playerParty));
      }
    });
    return null;
  },
  getAdjacentLocations(location: Location) {
    return location.adjacentLocations.map((loc) => LOCATIONS[loc].name).join(', ');
  },
  getLocationActivities(location: Location) {
    let response = 'You can ';
    location.buildings.forEach((building) => {
      if (building === 'POKEMART') {
        response += 'go to the PokieMart,';
      } else if (building === 'POKECENTER') {
        response += 'go to the PokieCenter,';
      } else if (building === 'GYM') {
        response += 'go to the gym to battle the leader,';
      }
    });
    response += location.buildings.length > 0 ? ' or ' : '';
    response += `go to another area, ${helper.getAdjacentLocations(location)}. `;
    return response;
  },
  getEffectivity(effectivity: number) {
    // need to reference type chart
    let string = '';
    switch (effectivity) {
      case 0:
        string += 'It had no effect...';
        break;
      case 0.25:
        string += "It's extremely ineffective...";
        break;
      case 0.5:
        string += "It's not very effective...";
        break;
      case 1:
        string += '';
        break;
      case 2:
        string += "It's super effective! ";
        break;
      case 4:
        string += "It's super duper effective! ";
        break;
      default:
    }
    return string;
  },
  getHealthyParty(party: Pokemon[]) {
    return party.reduce((pokemon, poke) => {
      if (poke.stats.hp > 0) {
        pokemon.push(poke);
      }
      return pokemon;
    }, [] as Pokemon[]);
  },
  getMaxHp(poke: Pokemon) {
    return (
      Math.floor(((2 * poke.base.hp + poke.individualValues.hp + Math.floor(poke.effortValues.hp / 4)) * poke.level) / 100) + poke.level + 10
    );
  },
  getMaxStat(poke: Pokemon, stat: StatName) {
    return Math.floor(
      Math.floor(((2 * poke.base[stat] + poke.individualValues[stat] + Math.floor(poke.effortValues[stat] / 4)) * poke.level) / 100) + 5,
    )
  },
  getPronouns(sex: Sex) {
    const isBoy = sex === 'boy';
    return {
      possessive: isBoy ? 'his' : 'her',
      subject: isBoy ? 'he' : 'she',
      object: isBoy ? 'him' : 'her',
      child: isBoy ? 'son' : 'daughter',
      grandChild: isBoy ? 'grandson' : 'granddaughter',
    } as const;
  },
  getRandomSubarray(arr: any[], size: number) {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp;
    let index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  },
  getStatusEffect(poke: Pokemon, stat: ModifierName, modifierValue: DamageModifiers) {
    let statLong;
    switch (stat) {
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
      default:
    }
    const string = `${poke.name}'s ${statLong} `;
    // TODO fix this below
    let mod = '';
    switch (modifierValue) {
      case -2:
        mod = 'harshly fell! ';
        break;
      case -1:
        mod = 'fell! ';
        break;
      case 1:
        mod = 'rose! ';
        break;
      case 2:
        mod = 'sharply rose! ';
        break;
      default:
    }
    return string + mod;
  },
  getStatusMult(poke: Pokemon) {
    switch (poke.status) {
      case 'SLEEP':
      case 'FREEZE':
        return 2;
      case 'PARALYZE':
      case 'POISON':
      case 'BURN':
        return 1.5;
      default:
        return 1;
    }
  },
  hasMove(poke: Pokemon, chosenMove: AvailableMoves) {
    for (let moveIndex = 0; moveIndex < poke.moveSet.length; moveIndex++) {
      if (MOVE_SET[chosenMove].name === poke.moveSet[moveIndex].name) {
        return moveIndex;
      }
    }
    return -1;
  },
  healTeam(party: Pokemon[]) {
    party.forEach((poke) => helper.heal(poke));
  },
  heal(poke: Pokemon) {
    poke.stats.hp = helper.getMaxHp(poke);
    poke.moveSet.forEach(function (move) {
      const foundMove = Object.values(MOVE_SET).find((m) => m.name === move.name);
      if (foundMove) {
        move.pp = foundMove.pp;
      }
    });
    // reset status such as sleep or paralysis
  },
  // checks to see if POKE has fainted, either can own it
  // playerName should always be the Alexa player, oppName should always be opponent's name, etc., but poke is the poke to check if fainted
  isFainted(playerName: string, oppName: string, party: Pokemon[], oppParty: Pokemon[], poke: Pokemon, second: boolean, location: Location) {
    let response = '';
    let healthyArr;
    const playerPoke = party[0];
    let opp;
    // let explvl;
    let money = 0;
    let fainted = false;
    let state;

    if (poke.stats.hp <= 0) {
      fainted = true;
      if (poke.OT === playerName) {
        // player needs to switch out pokemon if they have one
        response += `Your ${poke.name} has fainted! `;

        healthyArr = helper.getHealthyParty(party);

        if (healthyArr.length === 0) {
          money = Math.floor(0.333 * helper.endBattle(party));
          response += `${playerName} is out of usable Pokemon! ${playerName} blacked out! ${playerName} dropped ${money} PokieDollars and ran off! Do you still want to continue?`;
          money = -money;
          state = STATES.WHITEOUTMODE;
        } else {
          response += `You have the following Pokemon left: ${healthyArr.join(' ')}. Please say 'switch' and then the Pokemon's name in order to switch them. `;
          state = STATES.SWITCHPOKEMODE;
        }
      } else {
        opp = poke;
        const [experience, hasLeveledUp] = helper.addExperience(playerPoke, opp);
        response += `${playerName} defeated ${poke.OT === 'wild' ? 'wild' : `${poke.OT}'s`} ${poke.name}! ${playerPoke.name} gained ${experience} experience. `;
        response += hasLeveledUp ? `${playerPoke.name} went up to level ${playerPoke.level}! ` : '';
        if (poke.OT === 'wild') {
          // wild pokemon fainted and battle is over
          helper.endBattle(party);
          state = STATES.BATTLEOVERMODE;
        } else {
          // pokemon is owned by trainer, must check to switch out or battle is over
          const oppHealthyParty = helper.getHealthyParty(oppParty);
          if (oppHealthyParty.length >= 1) {
            // opp has a healthy pokemon left
            let pokeIndex;
            for (pokeIndex = 0; pokeIndex < oppParty.length; pokeIndex++) {
              if (oppParty[pokeIndex].stats.hp > 0) {
                break;
              }
            }
            helper.switchPokemon(oppParty, 0, pokeIndex);
            response += `${oppParty[0].OT} sent out ${oppParty[0]}! `;
            response += helpBattle;
          } else {
            // opp has been defeated
            money = helper.endBattle(party);
            response += `${playerName} earned ${money} PokieDollars from ${oppName}. `;

            // Trainer should be able to make witty response!

            state = STATES.BATTLEOVERMODE;
          }
        }
      }
    } else {
      response += second ? helpBattle : '';
      state = STATES.BATTLEMODE;
    }
    if (state === STATES.BATTLEOVERMODE) {
      // if regular trainer, go back to movementmode, if gym battle, go back to city mode, else who knows
      // also add to response!!
      if (location.gym) {
        state = STATES.CITYMODE;
        response += 'You exit the gym and look around the city. ';
      } else {
        state = STATES.MOVEMENTMODE;
        response += 'You start walking along the route again. Would you like to continue to the next area? Or say train to keep training. ';
      }
    }
    return { fainted, response, state, money };
  },
  nthroot(num: number, root: number): number {
    try {
      // num 5000 root 3
      // Only use positive numbers
      let posNum = num;
      const negate = root % 2 === 1 && num < 0;
      if (negate) {
        posNum = -num;
      }
      const possible = posNum ** (1 / root);
      // possible 17.099
      const value = possible ** root;
      // value 5000.000000000002
      if (Math.abs(posNum - value) < 1 && posNum > 0 === value > 0) {
        return negate ? -possible : possible;
      }
      return 0; // not sure what to return here
    } catch (e) {
      return 0; // not sure what to return here
    }
  },
  randomAction(location: Location) {
    const probNothingHappens = 60;
    if (location.type !== 'ROUTE') {
      return null;
    }
    const range = location.trainers + location.grass + location.items.length + probNothingHappens;
    const rand = Math.random() * range;
    if (rand < location.trainers) {
      return 'trainer';
    }
    if (rand < location.trainers + location.grass) {
      return 'wild';
    }
    if (rand < location.trainers + location.grass + location.items.length) {
      return 'item';
    }
    return null;
  },
  resetStats(poke: Pokemon) {
    poke.stats.hp = helper.getMaxHp(poke);
    poke.stats.spdef = helper.getMaxStat(poke, 'spdef');
    poke.stats.spatk = helper.getMaxStat(poke, 'spatk');
    poke.stats.def = helper.getMaxStat(poke, 'def');
    poke.stats.atk = helper.getMaxStat(poke, 'atk');
    poke.stats.speed = helper.getMaxStat(poke, 'speed');

    // is this correct?
    Object.keys(poke.modifiers).forEach((mod) => {
      poke.modifiers[mod] = 0;
    });
    // for (const mod in poke.modifiers) {
    //   poke.modifiers[mod] = 0;
    // }
  },
  screamingSnake<T extends string | undefined>(str: any): T {
    if (typeof str === 'undefined') {
      // @ts-ignore
      return undefined;
    }
    console.log({ original: str, deburred: deburr(str) })
    return deburr(String(str)).replace(' ', '_').toUpperCase();
  },
  speakAs(response: string, character: CharacterVoice) {
    switch (character.char) {
      case 'oak':
        return `<prosody pitch="x-low">${helper.speakWithVoice(response, character.japanese ? 'Takumi' : 'Matthew')}</prosody>`;
      case 'rival':
        return `<prosody pitch="high" rate="fast">${helper.speakWithVoice(response, character.sex === 'boy' ? 'Geraint' : 'Amy')}</prosody>`;
      case 'player':
        return `<prosody>${helper.speakWithVoice(response, character.sex === 'boy' ? 'Justin' : 'Salli')}</prosody>`;
      case 'mom':
        return `<prosody>${helper.speakWithVoice(response, 'Joanna')}</prosody>`;
      case 'nurse':
        return `<prosody>${helper.speakWithVoice(response, 'Mizuki')}</prosody>`;
      case 'mart':
        return `<prosody pitch="high" rate="fast">${helper.speakWithVoice(response, 'Russell')}</prosody>`;
      default:
        return response;
    }
  },
  speakAsPlayer(response: string, sex: Sex) {
    return helper.speakAs(response, { char: 'player', sex });
  },
  speakAsOak(response: string, japanese?: boolean) {
    return helper.speakAs(response, { char: 'oak', japanese });
  },
  speakAsRival(response: string, sex: Sex) {
    return helper.speakAs(response, { char: 'rival', sex });
  },
  speakAsMom(response: string) {
    return helper.speakAs(response, { char: 'mom' });
  },
  speakAsNurse(response: string) {
    return helper.speakAs(response, { char: 'nurse' });
  },
  speakAsMart(response: string) {
    return helper.speakAs(response, { char: 'mart' });
  },
  speakWithVoice(response: string, name: string) {
    return `<voice name="${name}">${response}</voice>`;
  },
  switchPokemon(party: Pokemon[], p1: number, p2: number) {
    // switching by index
    const a = party[p1];
    party[p1] = party[p2];
    party[p2] = a;
  },
};

type CharacterVoice =
  | {
      char: 'oak';
      japanese?: boolean;
    }
  | {
      char: 'rival' | 'player';
      sex: Sex;
    }
  | {
      char: 'mom' | 'nurse' | 'mart';
    };
