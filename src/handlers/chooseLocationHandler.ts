import { AvailableLocations, LOCATIONS } from "../constants/locations";
import { STATES } from "../constants/states";
import { helper } from "../helper";
import { HandlerThis } from "./HandlerThis";

export function chooseLocationHandler(this: HandlerThis) {
  let response;
  const { location } = this.attributes;
  console.log(this.event.request.intent.slots);
  const chosenLocationKey = helper.screamingSnake<AvailableLocations>(this.event.request.intent.slots.Location.value);
  const chosenLocation = LOCATIONS[chosenLocationKey];
  if (location.adjacentLocations.includes(chosenLocationKey)) {
    const nextLocation = chosenLocation;
    this.attributes.location = nextLocation;
    response = `You made it safely to ${nextLocation.name}. `;
    if (nextLocation.type === 'CITY') {
      this.handler.state = STATES.CITYMODE;
      response += helper.modeAvailableActions(this.attributes, this.handler.state);
    } else {
      this.handler.state = STATES.MOVEMENTMODE;
      response += helper.modeAvailableActions(this.attributes, this.handler.state);
    }
  } else {
    response = `You can't go to ${chosenLocation.name} from ${location.name}. `;
    response += helper.modeAvailableActions(this.attributes, this.handler.state);
  }
  this.emit(':ask', response, response);
}