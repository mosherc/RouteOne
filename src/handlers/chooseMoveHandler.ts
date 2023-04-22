import { AvailableMoves } from "../constants/move-set";
import { STATES } from "../constants/states";
import { helper } from "../helper";
import { HandlerThis } from "./HandlerThis";

export function chooseMoveHandler(this: HandlerThis) {
  const { party, opponentParty, opponentName, playerName, location } = this.attributes;
  if (!opponentParty || !opponentName) {
    throw new Error('opponentParty or opponentName not defined in ChooseMoveIntent');
  }
  const poke = party[0];
  const opp = opponentParty[0];
  const chosenMove = helper.screamingSnake<AvailableMoves>(this.event.request.intent.slots.Move.value);
  const moveset = poke.moveSet;
  const oppMove = opp.moveSet[helper.generateRandomInt(0, opp.moveSet.length - 1)];
  let response = '';

  // Need to check if player must use struggle because out of PP on all moves
  const moveIndex = helper.hasMove(poke, chosenMove);
  if (moveIndex > -1) {
    // move is in moveset
    const move = moveset[moveIndex];
    if (move.pp > 0) {
      // need to see who is faster
      if (poke.stats.speed > opp.stats.speed) {
        // playerFirst();
        response += helper.attack(poke, opp, move);
        let faintRes = helper.isFainted(playerName, opponentName, party, opponentParty, opp, false, location);
        response += faintRes.response;
        this.attributes.money += faintRes.money;
        this.handler.state = faintRes.state;
        if (!faintRes.fainted) {
          response += helper.attack(opp, poke, oppMove);
          faintRes = helper.isFainted(playerName, opponentName, party, opponentParty, poke, true, location);
          this.handler.state = faintRes.state;
          response += faintRes.response;
        }
      } else if (poke.stats.speed < opp.stats.speed) {
        // playerSecond();
        response += helper.attack(opp, poke, oppMove);
        let faintRes = helper.isFainted(playerName, opponentName, party, opponentParty, poke, false, location);
        response += faintRes.response;
        this.handler.state = faintRes.state;
        if (!faintRes.fainted) {
          response += helper.attack(poke, opp, move);
          faintRes = helper.isFainted(playerName, opponentName, party, opponentParty, opp, true, location);
          this.handler.state = faintRes.state;
          response += faintRes.response;
        }
      } else if (Math.random() < 0.5) {
        // randomly choose who goes first
        // playerFirst();
        response += helper.attack(poke, opp, move);
        let faintRes = helper.isFainted(playerName, opponentName, party, opponentParty, opp, false, location);
        response += faintRes.response;
        this.handler.state = faintRes.state;
        if (!faintRes.fainted) {
          response += helper.attack(opp, poke, oppMove);
          faintRes = helper.isFainted(playerName, opponentName, party, opponentParty, poke, true, location);
          this.handler.state = faintRes.state;
          response += faintRes.response;
        }
      } else {
        // playerSecond();
        response += helper.attack(opp, poke, oppMove);
        let faintRes = helper.isFainted(playerName, opponentName, party, opponentParty, poke, false, location);
        response += faintRes.response;
        this.handler.state = faintRes.state;
        if (!faintRes.fainted) {
          response += helper.attack(poke, opp, move);
          faintRes = helper.isFainted(playerName, opponentName, party, opponentParty, opp, true, location);
          this.handler.state = faintRes.state;
          response += faintRes.response;
        }
      }
    } else {
      // move is out of PP
      response += 'That move is out of PP. Select a different move.';
    }
  } else {
    // move is not in moveset
    response = 'That is not an available move. Select a different move.';
  }
  // if state is not BATTLEMODE, then need to reset battle (or reset battle in following modes?)
  if (this.handler.state === STATES.CITYMODE && location.type === 'CITY') {
    response += helper.getLocationActivities(location);
  }
  this.emit(':ask', response, response);
}