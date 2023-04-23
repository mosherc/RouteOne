import { AvailableLocations, LOCATIONS } from "../constants/locations";
import { helpMovement } from "../constants/messages";
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
      response += helper.getLocationActivities(nextLocation);
      this.handler.state = STATES.CITYMODE;
    } else {
      response += helpMovement;
      this.handler.state = STATES.MOVEMENTMODE;
    }
  } else {
    response = `You can't go to ${chosenLocation.name} from ${location.name}. There is ${location.adjacentLocations.map((loc) => loc.split('_').join(' ').toLowerCase()).join(', ')}.`;
  }
  this.emit(':ask', response, response);
}