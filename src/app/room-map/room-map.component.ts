import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ContentChildren, QueryList, AfterContentInit, ViewChildren } from '@angular/core';
import { RandomService } from '../random/random.service';
import { CharacterComponent } from '../character/character.component';
import { FloorComponent } from '../floor/floor.component';

import { Database } from '../domain/Roomdb';
import { Room } from '../domain/Room';
import { Player } from '../domain/Player';
import { Floor, CardType, Orientation } from '../domain/EnumTypes';
import { Point } from '../domain/Point';

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

    this.rooms = Database.map;

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
    console.log(`Floors: ${this.floors.toArray().length}`);
    this.floors.toArray().forEach(f => {
      f.roomClick.subscribe(this.onRoomClicked);
    });
  }

  showFloor(floor: string) : string {
    return (floor === this.activeMap) ? 'show' : 'hide';
  }

  /**Move the current player to the selected room. */
  onRoomClicked = (pos: Point) : void => {

    let player = this.players[this.currentPlayer];

    if (!player.hasMovesRemaining()) {
      alert("You do not have any moves remaining");
    }

    console.log(`Clicked: ${this.activeMap}, (${pos.x}, ${pos.y})`);

    let currentRoom = this.getCurrentMapRoom(player.location.x, player.location.y);
    let clickedRoom = this.getCurrentMapRoom(pos.x, pos.y);

    if (currentRoom === clickedRoom) {
      this.setPlayerPosition(player, pos.x, pos.y, this.activeMapToFloor());
      this.setReachableRooms();
      return;
    }

    // Need to add a new room.
    if (clickedRoom === undefined && this.adjacentTo(currentRoom, player.location.x, player.location.y, clickedRoom, pos.x, pos.y, true)) {
      console.log(`Adding a new room at ${pos.x},${pos.y}`);
      // Select a new room 
      let newRoomOptions = this.rooms.filter(r => !this.usedRooms.has(JSON.stringify(r)) && (r.floor & this.activeMapToFloor()) > 0);
      // Ensure there are still rooms to select.
      if (newRoomOptions.length > 0) {
        let newRoom = newRoomOptions[Math.ceil(Math.random() * newRoomOptions.length) - 1];
        newRoom.isNewRoom = true;
        newRoom.hasBeenVisited = false;

        let map = this.activeMapToMap();
        map[pos.x][pos.y] = newRoom;
        this.usedRooms.add(JSON.stringify(newRoom));

      } else {
        alert("There are no more rooms to add on this floor");
      }
    }

    else {
      console.log("Moving to an already discovered room.");
      // Make sure the clicked room is reachable.
      if (this.reachableRooms.has(JSON.stringify(pos))) {
        console.log("Room is reachable");
        // Make sure the player can still move
        if (player.hasMovesRemaining()) {
          console.log("Player has moves remaining");
          // Make sure the room is one tile away from the player.
          if (this.adjacentTo(currentRoom, player.location.x, player.location.y, clickedRoom, pos.x, pos.y)) {
            // Set the player's new position, remove one from their stamina, and update the reachable rooms.
            console.log(`Moving current player to ${pos.x},${pos.y}`);
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

    console.log(`${x1},${y1} -> ${x2},${y2}`);
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

  floorToActiveMap(floor: Floor) : string {
    switch (floor) {
      case Floor.Basement: return "b";
      case Floor.Ground: return "g";
      case Floor.Upper: return "u";
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

      let currentRoom = this.getCurrentPlayerRoom(x, y);

      if (depth > 0) {
        // North room.
        if (y - 1 >= 0) {
          let northRoom = this.getCurrentPlayerRoom(x, y - 1);
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
          let eastRoom = this.getCurrentPlayerRoom(x + 1, y);
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
          let southRoom = this.getCurrentPlayerRoom(x, y + 1);
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
          let westRoom = this.getCurrentPlayerRoom(x - 1, y);
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
    this.activeMap = this.floorToActiveMap(this.players[this.currentPlayer].floor);
    this.players[this.currentPlayer].startMove();
    this.setReachableRooms();
  }

  setPlayerPosition(player: Player, x: number, y: number, floor: Floor, forced: boolean = false) {
    
    let mapOfFloor = this.floorToActiveMap(floor);
    this.activeMap = mapOfFloor;

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
      if (!forced) {
        this.movementEffects(player, x, y);
      }
    } else {
      alert(`Cannot set player at position (${x}, ${y})`);
    }
  }

  movementEffects(player: Player, x: number, y: number) {
    let room = this.getCurrentMapRoom(x, y);
    var location;
    var nextRoom;
    switch (room.name) {
      case "Grand Staircase":
        nextRoom = this.getRoomByName("Upper Landing");
        location = this.getRoomLocationByFloor(nextRoom, Floor.Upper);

        this.setPlayerPosition(player, location.x, location.y, Floor.Upper, true);
        break;

      case "Upper Landing":
        nextRoom = this.getRoomByName("Grand Staircase");
        location = this.getRoomLocationByFloor(nextRoom, Floor.Ground);

        this.setPlayerPosition(player, location.x, location.y, Floor.Ground, true);
        break;

      case "Game Room":

        break;

      case "Chapel":

        break;

      case "Coal Chute": // Anywhere -> Basement
        
        break;
    }

  }

  getMapByFloor(floor: Floor) : Room[][] {
    switch (floor) {
      case Floor.Basement: return this.basementMap;
      case Floor.Ground: return this.groundMap;
      case Floor.Upper: return this.upperMap;
    }
  }

  getRoomByName(name: string) : Room {
    return this.rooms.find(r => r.name === name);
  }

  getRoomLocationByFloor(room: Room, floor: Floor) : Point {
    let map = this.getMapByFloor(floor);
    for (let i = 0; i < this.colCount; i++) {
      for (let j = 0; j < this.rowCount; j++) {
        if (map[i][j] === room) {
          return new Point(i, j);
        }
      }
    }
    return new Point(-1, -1);
  }

  getRoomLocationByNameAndFloor(name: string, floor: Floor) : Point {
    let map = this.getMapByFloor(floor);
    for (let i = 0; i < this.colCount; i++) {
      for (let j = 0; j < this.rowCount; j++) {
        if (map[i][j].name === name) {
          return new Point(i, j);
        }
      }
    }
    return new Point(-1, -1);
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

  getRoomByLocationAndFloor(i: number, j: number, floor: Floor) {
    return this.getMapByFloor(floor)[i][j];
  }

  /**Get the room on the same floor as the current player at the specified location. */
  getCurrentPlayerRoom(i: number, j: number) {
    return this.getMapByFloor(this.players[this.currentPlayer].floor)[i][j];
  }

  /**Get the room from the room map with the specified x and y coordinates. */
  getCurrentMapRoom(i: number, j: number) {
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

