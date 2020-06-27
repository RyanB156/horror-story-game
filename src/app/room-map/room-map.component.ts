import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ContentChildren, QueryList, AfterContentInit, ViewChildren } from '@angular/core';
import { RandomService } from '../random/random.service';
import { CharacterComponent } from '../character/character.component';

import { Room } from '../domain/Room';
import { Player } from '../domain/Player';
import { Floor, CardType, Orientation } from '../domain/EnumTypes';
import { Point } from '../domain/Point';
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

  Trigger card effects when a new room is added (Omen, Event, Item).
  Move to next level when moving onto the stairs.
  Make mystic elevator work with dice roll.
  Event rooms like Broken Floor, Coal Chute, etc.
  Haunt counter.
  Haunt dice roll when activating Omen cards.
  Manual.
  Survivors manual.
  Haunt manual.
  Tokens.
  Character images.

*/

/*
  Bugs:
    Rooms can be randomly chosen more than once.
*/

@Component({
  selector: 'app-room-map',
  templateUrl: './room-map.component.html',
  styleUrls: ['./room-map.component.scss']
})
export class RoomMapComponent implements OnInit, AfterViewInit {
  @ViewChildren(FloorComponent) floors: QueryList<FloorComponent>;
  @ViewChildren(CharacterComponent) characters: QueryList<CharacterComponent>;

  rowCount: number = 10;
  colCount: number = 10;
  rows: number[] = new Array(this.rowCount);
  cols: number[] = new Array(this.colCount);

  players: Player[] = [];
  currentPlayer: number = -1;

  diceToRoll: number = 2;
  rollNumber: number = 0;
  randomService: RandomService;

  activeMap: string = "g";

  basementMap: Room[][];
  groundMap: Room[][];
  upperMap: Room[][];

  rooms: Room[];
  usedRooms: Set<string> = new Set();
  reachableRooms: Set<string> = new Set();

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
    this.basementMap[3][3] = this.getRoomByNameAndUse("Basement Landing");
    //

    // Ground starting rooms
    this.groundMap[4][4] = this.getRoomByNameAndUse("Library");

    this.groundMap[4][5] = this.getRoomByNameAndUse("Entrance Hall");
    this.setPlayerPosition(this.players[0], 4, 5, Floor.Ground);

    this.groundMap[5][5] = this.getRoomByNameAndUse("Foyer");
    this.setPlayerPosition(this.players[1], 5, 5, Floor.Ground);

    this.groundMap[5][6] = this.getRoomByNameAndUse("Organ Room");
    this.groundMap[5][7] = this.getRoomByNameAndUse("Junk Room");
    
    this.groundMap[6][7] = this.getRoomByNameAndUse("Game Room");
    this.groundMap[6][7].setDirection(Orientation.West);

    this.groundMap[6][6] = this.getRoomByNameAndUse("Conservatory");
    this.groundMap[6][6].setDirection(Orientation.South);

    this.groundMap[6][5] = this.getRoomByNameAndUse("Grand Staircase");
    //

    // Upper starting rooms
    this.upperMap[7][4] = this.getRoomByNameAndUse("Upper Landing");
    //

    this.players.forEach(p => p.startMove());

    this.nextPlayer();
    this.setReachableRooms();
    console.log(this.reachableRooms);
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() : void {
    this.floors.toArray().forEach(f => {
      f.roomClick.subscribe(this.onRoomClicked);
    });
  }

  /**Move the current player to the selected room. */
  onRoomClicked = (pos: Point) : void => {

    console.log(`Moving current player to ${pos.x},${pos.y}`);

    let player = this.players[this.currentPlayer];

    if (!player.hasMovesRemaining()) {
      alert("You do not have any moves remaining");
    }

    let currentRoom = this.getRoom(player.location.x, player.location.y);
    let clickedRoom = this.getRoom(pos.x, pos.y);

    // Need to add a new room.
    if (clickedRoom === undefined && this.adjacentTo(currentRoom, player.location.x, player.location.y, clickedRoom, pos.x, pos.y, true)) {

      // Select a new room 
      let newRoomOptions = this.rooms.filter(r => !this.usedRooms.has(JSON.stringify(r)) && (r.floor & this.activeMapToFloor()) > 0);
      // Ensure there are still rooms to select.
      if (newRoomOptions.length > 0) {
        let newRoom = newRoomOptions[Math.ceil(Math.random() * newRoomOptions.length) - 1];
        newRoom.isNewRoom = true;

        let map = this.activeMapToMap();
        map[pos.x][pos.y] = newRoom;
        this.usedRooms.add(JSON.stringify(newRoom));

      } else {
        alert("There are no more rooms to add on this floor");
      }
    }

    else {
      // Make sure the clicked room is reachable.
      if (this.reachableRooms.has(JSON.stringify(pos))) {
        // Make sure the player can still move
        if (player.hasMovesRemaining()) {
          // Make sure the room is one tile away from the player.
          if (this.adjacentTo(currentRoom, player.location.x, player.location.y, clickedRoom, pos.x, pos.y)) {
            // Set the player's new position, remove one from their stamina, and update the reachable rooms.
            this.setPlayerPosition(player, pos.x, pos.y, this.activeMapToFloor());
            player.move();
            this.setReachableRooms();
            console.log(player);
          } else {
            alert("You must move to rooms one-by-one");
          }
        }
      }
    }
  }

  adjacentTo(startRoom: Room, x1: number, y1: number, endRoom: Room, x2: number, y2: number, ignoreEndUndefined: boolean = false) : boolean {

    if (endRoom === undefined) {
      if (ignoreEndUndefined && Math.abs(x2 - x1) + Math.abs(y2 - y1) === 1) {
        if (x1 === x2) { // Check vertical doors.
          if (y1 > y2) { // startRoom is below endRoom.
            return (startRoom.openDoors & Orientation.North) > 0;
          } else { // startRoom is above endRoom.
            return (startRoom.openDoors & Orientation.South) > 0;
          }
        } else { // Check horizontal doors.
          if (x1 > x2) { // startRoom is to the right of endRoom.
            return (startRoom.openDoors & Orientation.West) > 0;
          } else { // startRoom is to the left of endRoom.
            return (startRoom.openDoors & Orientation.East) > 0;
          }
        }
      }
    }

    console.log(`${x1},${y1} -> ${x2}, ${y2}`);
    if (Math.abs(x2 - x1) + Math.abs(y2 - y1) === 1) {
      // Check vertical adjacency.
      if (x1 === x2) {
        return ((startRoom.openDoors & Orientation.South) > 0 && (endRoom.openDoors & Orientation.North) > 0) ||
        (startRoom.openDoors & Orientation.North) > 0 && (endRoom.openDoors & Orientation.South) > 0
      } else if (y1 === y2) { // Check horizontal adjacency.
        return ((startRoom.openDoors & Orientation.East) > 0 && (endRoom.openDoors & Orientation.West) > 0) ||
        (startRoom.openDoors & Orientation.West) > 0 && (endRoom.openDoors & Orientation.East) > 0
      }
    }
  }

  activeMapToFloor() : Floor {
    switch (this.activeMap) {
      case "b": return Floor.Basement;
      case "g": return Floor.Ground;
      case "u": return Floor.Upper;
      default: return Floor.Start;
    }
  }

  activeMapToMap() : Room[][] {
    switch (this.activeMap) {
      case "b": return this.basementMap;
      case "g": return this.groundMap;
      case "u": return this.upperMap;
    }
  }

  basementPlayers() : Player[] {
    return this.players.filter(p => p.floor === Floor.Basement);
  }

  groundPlayers() : Player[] {
    return this.players.filter(p => p.floor === Floor.Ground);;
  }

  upperPlayers() : Player[] {
    return this.players.filter(p => p.floor === Floor.Upper);
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
    this.diceToRoll = evt[0];
    this.roll();
  }

  setReachableRooms() : void {

    this.reachableRooms = new Set();

    let player = this.players[this.currentPlayer];
    let depth = player.movesRemaining;

    let inner = ((x: number, y: number, depth: number) => {

      let currentRoom = this.getRoom(x, y);

      if (depth > 0) {
        // North room.
        if (y - 1 >= 0) {
          let northRoom = this.getRoom(x, y - 1);
          if ((currentRoom.openDoors & Orientation.North) > 0) {
            this.reachableRooms.add(JSON.stringify(new Point(x, y - 1)));
            // If the player can move North into the next room...
            if (northRoom !== undefined && (northRoom.openDoors & Orientation.South) > 0) {
              inner(x, y - 1, depth - 1);
            }
          }
        }
        // East room.
        if (x + 1 < this.colCount) {
          let eastRoom = this.getRoom(x + 1, y);
          if ((currentRoom.openDoors & Orientation.East) > 0) {
            this.reachableRooms.add(JSON.stringify(new Point(x + 1, y)));
            // If the player can move East into the next room...
            if (eastRoom !== undefined && (eastRoom.openDoors & Orientation.West) > 0) {
              inner(x + 1, y, depth - 1);
            }
          }
        }
        // South room.
        if (y + 1 < this.rowCount) {
          let southRoom = this.getRoom(x, y + 1);
          if ((currentRoom.openDoors & Orientation.South) > 0) {
            this.reachableRooms.add(JSON.stringify(new Point(x, y + 1)));
            // If the player can move South into the next room...
            if (southRoom !== undefined && (southRoom.openDoors & Orientation.North) > 0) {
              inner(x, y + 1, depth - 1);
            }
          }
        }
        // West room.
        if (x - 1 >= 0) {
          let westRoom = this.getRoom(x - 1, y);
          if ((currentRoom.openDoors & Orientation.West) > 0) {
            this.reachableRooms.add(JSON.stringify(new Point(x - 1, y)));
            // If the player can move West into the next room...
            if (westRoom !== undefined && (westRoom.openDoors & Orientation.East) > 0) {
              inner(x - 1, y, depth - 1);
            }
          }
        }
      }
    });

    inner(player.location.x, player.location.y, depth);
  }

  nextPlayer() : void {
    this.currentPlayer++;
    this.currentPlayer %= this.players.length;
    this.players[this.currentPlayer].startMove();
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
      player.location = new Point(x, y);
      player.floor = floor;
    } else {
      alert(`Cannot set player at position (${x}, ${y})`);
    }
  }

  getRoomByName(name: string) : Room {
    return this.rooms.find(r => r.name === name);
  }

  getRoomByNameAndUse(name: string) : Room {
    let room = this.rooms.find(r => r.name === name);
    if (!this.usedRooms.has(JSON.stringify(room))) {
      this.usedRooms.add(JSON.stringify(room));
      return room;
    } else {
      throw new Error("This room has already been used");
    }
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

