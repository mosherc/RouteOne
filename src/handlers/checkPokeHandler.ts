import { STATES } from "../constants/states";
import { helper } from "../helper";
import { HandlerThis } from "./HandlerThis";

export function checkPokeHandler(this: HandlerThis) {
  const { party, opponentParty } = this.attributes;

  let response;
  party.forEach((poke) => {
    response += `Your ${poke.name} is level ${poke.level} and has ${poke.stats.hp} out of ${helper.getMaxHp(poke)} H P. `;
  })

  if (this.handler.state === STATES.BATTLEMODE) {
    opponentParty.forEach((poke) => {
      const trainer = poke.OT === 'wild' ? 'Wild' : `${poke.OT}'s`;
      response += `${trainer} ${poke.name} is level ${poke.level} and has ${poke.stats.hp} out of ${helper.getMaxHp(poke)} H P. `;
    })
  }

  response += helper.modeAvailableActions(this.attributes, this.handler.state);

  this.emit(':ask', response, response);
}
