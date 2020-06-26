import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ContentChildren, QueryList, AfterContentInit, ViewChildren } from '@angular/core';
import { RandomService } from '../random/random.service';
import { CharacterComponent } from '../character/character.component';

import { Room } from '../domain/Room';
import { Player } from '../domain/Player';
import { Floor, CardType, Orientation } from '../domain/EnumTypes';
import { Pair } from '../domain/Pair';
import { FloorComponent } from '../floor/floor.component';

/* TODO:
  Set valid doorways for each room. These will need to be set when the room is fixed.
    Allow the player to move from one room to another.

  Allow player to move to different rooms.
    0 movement cost to move to upper landing from Grand Staircase

  Rooms component
    Players
    Floor level
    Card type
    Items
    Open doors
    Picture

  Players component
    speed, might, sanity, and knowledge values
    items
    cards
    image

  Tokens

  Manual book component

  Haunt book component

  Cards
    Character
      speed, might, sanity, and knowledge markers

    Omen
    Item
    Event

  Components


*/

@Component({
  selector: 'app-room-map',
  templateUrl: './room-map.component.html',
  styleUrls: ['./room-map.component.scss']
})
export class RoomMapComponent implements OnInit, AfterViewInit, AfterContentInit {
  
  @ViewChildren(CharacterComponent) characters: QueryList<CharacterComponent>;

  rowCount: number = 10;
  colCount: number = 10;
  rows: number[] = new Array(this.rowCount);
  cols: number[] = new Array(this.colCount);

  players: Player[] = [];
  currentPlayer: number = 0;

  diceToRoll: number = 2;
  rollNumber: number = 0;
  randomService: RandomService;

  activeMap: string = "g";

  basementMap: Room[][];
  groundMap: Room[][];
  upperMap: Room[][];

  rooms: Room[];
  reachableRooms: Set<Room> = new Set();

  constructor(randomService: RandomService) { 

    this.randomService = randomService;
    this.players.push(Player.madameZostra());
    this.players.push(Player.oxBellows());

    this.groundMap = new Array(this.rowCount);
    for (let i = 0; i < this.rowCount; i++) {
      this.groundMap[i] = new Array(this.colCount);
    }

    this.basementMap = new Array(this.rowCount);
    for (let i = 0; i < this.rowCount; i++) {
      this.basementMap[i] = new Array(this.colCount);
    }

    this.upperMap = new Array(this.rowCount);
    for (let i = 0; i < this.rowCount; i++) {
      this.upperMap[i] = new Array(this.colCount);
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
      new Room("Entrance Hall", Floor.Start, CardType.None, Room.threeDoors, Orientation.East),
      new Room("Foyer", Floor.Start, CardType.None, Room.fourDoors),
      new Room("Furnace Room", Floor.Basement, CardType.Omen, Room.threeDoors),
      new Room("Gallery", Floor.Upper, CardType.Omen, Room.oppositeDoors),
      new Room("Game Room", Floor.Basement | Floor.Ground | Floor.Upper, CardType.Event, Room.threeDoors),
      new Room("Gardens", Floor.Ground, CardType.Event, Room.oppositeDoors),
      new Room("Grand Staircase", Floor.Start, CardType.None, Room.oneDoor, Orientation.West),
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

    // Basement starting rooms
    this.basementMap[3][3] = this.getRoomByName("Basement Landing");
    //

    // Ground starting rooms
    this.groundMap[4][4] = this.getRoomByName("Library");

    this.groundMap[4][5] = this.getRoomByName("Entrance Hall");
    this.setPlayerPosition(this.players[0], 4, 5, Floor.Ground);

    this.groundMap[5][5] = this.getRoomByName("Foyer");
    this.setPlayerPosition(this.players[1], 5, 5, Floor.Ground);

    this.groundMap[5][6] = this.getRoomByName("Organ Room");
    this.groundMap[5][7] = this.getRoomByName("Junk Room");
    
    this.groundMap[6][7] = this.getRoomByName("Game Room");
    this.groundMap[6][7].setDirection(Orientation.West);

    this.groundMap[6][6] = this.getRoomByName("Conservatory");
    this.groundMap[6][6].setDirection(Orientation.South);

    this.groundMap[6][5] = this.getRoomByName("Grand Staircase");
    //

    // Upper starting rooms
    this.upperMap[7][4] = this.getRoomByName("Upper Landing");
    //

    console.log("Calling setReachableRooms");
    this.setReachableRooms();
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() : void {;

  }

  ngAfterContentInit() : void {
    
  }

  seeBasement() : void {
    this.activeMap = "b";
  }

  seeGround() : void {
    this.activeMap = "g";
  }

  seeUpper() : void {
    this.activeMap = "u";
  }

  statRoll(evt: [number, number]) : void {
    console.log("Received value");
        this.diceToRoll = evt[0];
        this.roll();
  }

  setReachableRooms() : void {

    this.reachableRooms = new Set();

    let player = this.players[this.currentPlayer];
    let depth = player.speedLevels[player.speed];

    let inner = ((x: number, y: number, depth: number) => {

      console.log(`inner called with (${x}, ${y}, ${depth})`);

      let currentRoom = this.getRoom(x, y);

      console.log("Checking:");
      console.log(currentRoom);

      if (depth > 0) {
        // North room.

        console.log("Checking y - 1");

        if (y - 1 >= 0) {
          let northRoom = this.getRoom(x, y - 1);
          if (northRoom !== undefined) {
            console.log(currentRoom);
            console.log(northRoom);

            // If the player can move North into the next room...
            if ((currentRoom.openDoors & Orientation.North) > 0 && (northRoom.openDoors & Orientation.South) > 0) {
              this.reachableRooms.add(northRoom);
              inner(x, y - 1, depth - 1);
            }
          }
        }
        // East room.

        console.log("Checking x + 1");

        if (x + 1 < this.colCount) {
          let eastRoom = this.getRoom(x + 1, y);
          if (eastRoom !== undefined) {
            console.log(currentRoom);
            console.log(eastRoom);

            // If the player can move East into the next room...
            if ((currentRoom.openDoors & Orientation.East) > 0 && (eastRoom.openDoors & Orientation.West) > 0) {
              this.reachableRooms.add(eastRoom);
              inner(x + 1, y, depth - 1);
            }
          }
        }
        // South room.

        console.log("Checking y + 1");

        if (y + 1 < this.rowCount) {
          let southRoom = this.getRoom(x, y + 1);
          if (southRoom !== undefined) {
            console.log(currentRoom);
            console.log(southRoom);

            // If the player can move South into the next room...
            if ((currentRoom.openDoors & Orientation.South) > 0 && (southRoom.openDoors & Orientation.North) > 0) {
              this.reachableRooms.add(southRoom);
              inner(x, y + 1, depth - 1);
            }
          }
        }
        // West room.

        console.log("Checking x - 1");

        if (x - 1 >= 0) {
          let westRoom = this.getRoom(x - 1, y);
          if (westRoom !== undefined) {
            console.log(currentRoom);
            console.log(westRoom);

            // If the player can move West into the next room...
            if ((currentRoom.openDoors & Orientation.West) > 0 && (westRoom.openDoors & Orientation.East) > 0) {
              this.reachableRooms.add(westRoom);
              inner(x - 1, y, depth - 1);
            }
          }
        }
      }
    });

    inner(player.location.x, player.location.y, depth);

    console.log(this.reachableRooms);
  }

  nextPlayer() : void {
    this.currentPlayer++;
    this.currentPlayer %= this.players.length;
    this.setReachableRooms();
  }

  setPlayerPosition(player: Player, x: number, y: number, floor: Floor) {
    
    var room;

    if (floor === Floor.Basement) {
      room = this.basementMap[x][y];
    } else if (floor === Floor.Ground) {
      room = this.groundMap[x][y];
    } else {
      room = this.upperMap[x][y];
    }
    
    if (room !== null) {
      player.location = new Pair(x, y);
      player.floor = floor;
      room.players.push(player);
    } else {
      alert(`Cannot set player at position (${x}, ${y})`);
    }
  }

  getRoomByName(name: string) : Room {
    return this.rooms.find(r => r.name === name);
  }

  /**Get the room from the room map with the specified x and y coordinates. */
  getRoom(i: number, j: number) {
    switch (this.activeMap) {
      case "b": return this.basementMap[i][j];
      case "g": return this.groundMap[i][j];
      case "u": return this.upperMap[i][j];
      default: throw new Error("Invalid floor type");

    }
  }

  test() {

  }

  roll() {
    this.randomService.getRandom(0, 2, this.diceToRoll).subscribe((numbers) => {
      let arr = numbers.split("	").filter(x => x !== "");
      this.rollNumber = arr.map(x => parseInt(x)).reduce((x, y) => x + y);
    });
  }

  getCard(i: number, j: number) {

  }

}

// Add buffs, debuffs, allow actions. Can be traded, gained from moving into rooms
class Card {
  name: string;
  description: string;

}

