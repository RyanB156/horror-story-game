import { Orientation, Floor, CardType } from '../domain/EnumTypes';
import { Player } from '../domain/Player';

export class Room {
  name: string = "";
  direction: Orientation = Orientation.North;
  openDoors: Orientation;
  path: string = "";
  floor: Floor;
  card: CardType;
  players: Player[] = [];

  constructor(name: string, floor: Floor, card: CardType, roomType: string, direction: Orientation = Orientation.North) {
    this.name = name;
    this.path = Room.getPath(roomType);
    this.floor = floor;
    this.card = card;
    this.setDirection(direction);
  }

  /**Get text representing the floor that the room is on. */
  getFloor() {
    let text = "";

    if (this.floor === Floor.Start)
      text += "S";
    if ((this.floor & Floor.Basement) > 0)
      text += "B";
    if ((this.floor & Floor.Ground) > 0)
      text += "G";
    if ((this.floor & Floor.Upper) > 0)
      text += "U";
    return text;
  }

  setDirection(direction: Orientation) {
    this.direction = direction;

    let roomType = this.path.split("/")[2];
    roomType = roomType.substring(0, roomType.length - 4);

    // Set possible open doors.
    // 4 doors.
    if (roomType === Room.fourDoors) {
      this.openDoors = Orientation.North | Orientation.East | Orientation.South | Orientation.West;
    } 
    // Corner doors.
    else if (roomType === Room.cornerDoors) {
      if (direction === Orientation.North) {
        this.openDoors = Orientation.North | Orientation.East;
      }
      else if (direction === Orientation.East) {
        this.openDoors = Orientation.East | Orientation.South;
      }
      else if (direction === Orientation.South) {
        this.openDoors = Orientation.South | Orientation.West;
      }
      else { // Orientation.West
        this.openDoors = Orientation.West | Orientation.North;
      }
    }
    // One door.
    else if (roomType === Room.oneDoor) {
      this.openDoors = direction;
    }
    // Opposite doors.
    else if (roomType === Room.oppositeDoors) {
      if (direction === Orientation.North || direction === Orientation.South) {
        this.openDoors = Orientation.North | Orientation.South;
      } else { // East and West.
        this.openDoors = Orientation.East | Orientation.West;
      }
    }
    // Three doors.
    else if (roomType === Room.threeDoors) {
      if (direction === Orientation.North) {
        this.openDoors = Orientation.North | Orientation.East | Orientation.West;
      } else if (direction === Orientation.East) {
        this.openDoors = Orientation.East | Orientation.South | Orientation.North;
      } else if (direction === Orientation.South) {
        this.openDoors = Orientation.South | Orientation.West | Orientation.East;
      } else { // Orientation.West
        this.openDoors = Orientation.West | Orientation.North | Orientation.South;
      }
    } else {
      alert(`Invalid room path: ${roomType}`);
    }
  }

  rotate(evt) : void {
    console.log("Rotating room");
    if (this.floor !== Floor.Start) {
      this.direction *= 2;
      if (this.direction > 8) {
        this.direction = 1;
      }
      console.log(evt);
    }
  }

  addPlayer(player: Player) {
    if (!this.players.includes(player)) {
      this.players.push(player);
    }
  }

  getDirectionClassName() {
    switch (this.direction) {
      case Orientation.North: return "north";
      case Orientation.East: return "east";
      case Orientation.South: return "south";
      case Orientation.West: return "west";
      default: return "none";
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