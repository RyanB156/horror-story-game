import { Orientation, Floor, CardType } from '../domain/EnumTypes';
import { Player } from '../domain/Player';

export class Room {
  name: string = "";
  direction: Orientation = Orientation.North;
  path: string = "";
  floor: Floor;
  card: CardType;
  players: Player[] = [];

  constructor(name: string, floor: Floor, card: CardType, roomType: string, direction: Orientation = Orientation.North) {
    this.name = name;
    this.path = Room.getPath(roomType);
    this.floor = floor;
    this.card = card;
    this.direction = direction;
  }

  setDirection(direction: Orientation) {
    this.direction = direction;
  }

  rotate(evt) : void {
    /*
    if (this.floor !== Floor.Start) {
      this.direction++;
      this.direction %= 4;
      console.log(evt);
    }
    */
  }

  addPlayer(player: Player) {
    if (!this.players.includes(player)) {
      this.players.push(player);
    }
  }

  static oneDoor: string = "roomOneDoor";
  static cornerDoors: string = "roomLDoors";
  static oppositeDoors: string = "roomOppositeDoors";
  static threeDoors: string = "roomThreeDoors";
  static fourDoors: string = "roomFourDoors";

  static getPath(roomType: string) : string {
    return "../assets/" + roomType + ".png";
  }

}