import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-room-map',
  templateUrl: './room-map.component.html',
  styleUrls: ['./room-map.component.scss']
})
export class RoomMapComponent implements OnInit {

  rowCount: number = 5;
  colCount: number = 5;
  rows: number[] = new Array(this.rowCount);
  cols: number[] = new Array(this.colCount);

  map: any;

  rooms: Room[];

  constructor() { 
    this.map = new Array(this.rowCount);
    for (let i = 0; i < this.rowCount; i++) {
      this.map[i] = new Array(this.colCount);
    }


    this.rooms = [
      new Room("Abandoned Room", Floor.Basement | Floor.Ground, CardType.Omen, Room.fourDoors),
      new Room("Attic", Floor.Upper, CardType.Event, Room.oneDoor),
      new Room("Balcony", Floor.Upper, CardType.Omen, Room.oppositeDoors),
      new Room("Ballroom", Floor.Ground, CardType.Event, Room.fourDoors),
      new Room("Basement Landing", Floor.Basement, CardType.None, Room.fourDoors),
      new Room("Bedroom", Floor.Upper, CardType.Event, Room.oppositeDoors),
      new Room("Bloody Room", Floor.Ground | Floor.Upper, CardType.Item, Room.fourDoors),
      new Room("Catacombs", Floor.Basement, CardType.Omen, Room.oppositeDoors),
      new Room("Chapel", Floor.Ground | Floor.Upper, CardType.Event, Room.oneDoor),
      new Room("Charred Room", Floor.Ground | Floor.Upper, CardType.Omen, Room.fourDoors),
      new Room("Chasm", Floor.Basement, CardType.None, Room.oppositeDoors),
      new Room("Coal Chute", Floor.Ground, CardType.None, Room.oneDoor),
      new Room("Collapsed Room", Floor.Ground | Floor.Upper, CardType.None, Room.fourDoors),
      new Room("Conservatory", Floor.Ground | Floor.Upper, CardType.Event, Room.oneDoor),
      new Room("Creaky Hallway", Floor.Basement | Floor.Ground | Floor.Upper, CardType.None, Room.fourDoors),
      new Room("Crypt", Floor.Basement, CardType.Event, Room.oneDoor),
      new Room("Dining Room", Floor.Ground, CardType.Omen, Room.oppositeDoors),
      new Room("Dusty Hallway", Floor.Basement | Floor.Ground | Floor.Upper, CardType.None, Room.fourDoors),
      new Room("Entrance Hall", Floor.Start, CardType.None, Room.threeDoors),
      new Room("Foyer", Floor.Start, CardType.None, Room.fourDoors),
      new Room("Furnace Room", Floor.Basement, CardType.Omen, Room.threeDoors),
      new Room("Gallery", Floor.Upper, CardType.Omen, Room.oppositeDoors),
      new Room("Game Room", Floor.Basement | Floor.Ground | Floor.Upper, CardType.Event, Room.threeDoors),
      new Room("Gardens", Floor.Ground, CardType.Event, Room.oppositeDoors),
      new Room("Grand Staircase", Floor.Start, CardType.None, Room.oppositeDoors, Orientation.East),
      new Room("Graveyard", Floor.Ground, CardType.Event, Room.oneDoor),
      new Room("Gymnasium", Floor.Basement | Floor.Upper, CardType.Omen, Room.oppositeDoors),
      new Room("Junk Room", Floor.Basement | Floor.Ground | Floor.Upper, CardType.Omen, Room.fourDoors),
      new Room("Kitchen", Floor.Basement | Floor.Ground, CardType.Omen, Room.oppositeDoors),
      new Room("Larder", Floor.Basement, CardType.Item, Room.oppositeDoors),
      new Room("Library", Floor.Ground | Floor.Upper, CardType.Event, Room.oppositeDoors),
      new Room("Master Bedroom", Floor.Upper, CardType.Omen, Room.oppositeDoors),
      new Room("Mystic Elevator", Floor.Basement | Floor.Ground | Floor.Upper, CardType.None, Room.oneDoor),
      new Room("Operating Laboratory", Floor.Basement | Floor.Upper, CardType.Event, Room.oppositeDoors),
      new Room("Organ Room", Floor.Basement | Floor.Ground | Floor.Upper, CardType.Event, Room.oppositeDoors),
      new Room("Patio", Floor.Ground, CardType.Event, Room.threeDoors),
      new Room("Pentagram Chamber", Floor.Basement, CardType.Omen, Room.oneDoor),
      new Room("Research Laboatory", Floor.Basement | Floor.Upper, CardType.Event, Room.oppositeDoors),
      new Room("Servants' Quarters", Floor.Basement | Floor.Upper, CardType.Omen, Room.fourDoors),
      new Room("Stairs From Basement", Floor.Basement, CardType.None, Room.oppositeDoors),
      new Room("Statuary Corridor", Floor.Basement | Floor.Ground | Floor.Upper, CardType.Event, Room.oppositeDoors),
      new Room("Storeroom", Floor.Basement | Floor.Upper, CardType.Item, Room.oppositeDoors),
      new Room("Tower", Floor.Upper, CardType.Event, Room.oppositeDoors),
      new Room("Underground Lake", Floor.Basement, CardType.Event, Room.oppositeDoors),
      new Room("Upper Landing", Floor.Start, CardType.None, Room.fourDoors),
      new Room("Vault", Floor.Basement | Floor.Upper, CardType.Event | CardType.Item, Room.oneDoor),
      new Room("Wine Cellar", Floor.Basement, CardType.Item, Room.oppositeDoors)
    ]

    this.map[0][0] = this.getRoomByName("Basement Landing");

    this.map[1][1] = this.getRoomByName("Library");

    this.map[2][1] = this.getRoomByName("Entrance Hall");
    this.map[2][2] = this.getRoomByName("Grand Staircase");
    this.map[2][3] = this.getRoomByName("Upper Landing");

  }

  getRoomByName(name: string) : Room {
    return this.rooms.find(r => r.name === name);
  }

  getRoom(i: number, j: number) {
    console.log(`Retrieving room (${i}, ${j})`)
    return this.map[i][j];
  }

  getFloor(i: number, j: number) {
    let room: Room = this.getRoom(i, j);
    let text = "";

    console.log("room.floor: " + room.floor);
    console.log("room.floor & Floor.Start: " + (room.floor & Floor.Start));
    console.log("room.floor & Floor.Basement: " + (room.floor & Floor.Basement));
    console.log("room.floor & Floor.Ground: " + (room.floor & Floor.Ground));
    console.log("room.floor & Floor.Upper: " + (room.floor & Floor.Upper));        

    if (room !== null) {
      if (room.floor === Floor.Start)
        text += "S";
      else if ((room.floor & Floor.Basement) > 0)
        text += "B";
      else if ((room.floor & Floor.Ground) > 0)
        text += "G";
      else if ((room.floor & Floor.Upper) > 0)
        text += "U";
    }
    return text;
  }

  ngOnInit(): void {
  }

}

class Player {
  location: Pair;

}

// Add buffs, debuffs, allow actions. Can be traded, gained from moving into rooms
class Card {
  name: string;
  description: string;

}

class Pair {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Room {
  name: string = "";
  direction: Orientation = Orientation.North;
  path: string = "";
  floor: Floor;
  card: CardType;

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
    this.direction++;
    this.direction %= 4;
    console.log(evt);
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

enum Orientation { North, East, South, West }
enum Floor { Start = 0, Basement = 1, Ground = 2, Upper = 4 }
enum CardType { None, Event, Omen, Item }
