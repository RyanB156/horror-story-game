import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { RandomService } from '../random/random.service';
import { CharacterComponent } from '../character/character.component';

import { Room } from '../domain/Room';
import { Player } from '../domain/Player';
import { Floor, CardType, Orientation } from '../domain/EnumTypes';
import { Pair } from '../domain/Pair';

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
  @ViewChild("mapTable") mapTable: ElementRef;
  @ContentChildren(CharacterComponent) characters: QueryList<CharacterComponent>;

  rowCount: number = 10;
  colCount: number = 10;
  rows: number[] = new Array(this.rowCount);
  cols: number[] = new Array(this.colCount);

  players: Player[] = [];
  currentPlayer: number = 0;

  diceToRoll: number = 2;
  rollNumber: number = 0;
  randomService: RandomService;

  map: Room[][];

  rooms: Room[];

  constructor(randomService: RandomService) { 

    this.randomService = randomService;
    this.players.push(Player.heatherGranville(1, 2));
    this.players.push(Player.oxBellows(2, 2));

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

    this.map[3][3] = this.getRoomByName("Basement Landing");

    this.map[4][4] = this.getRoomByName("Library");

    this.map[4][5] = this.getRoomByName("Entrance Hall");
    this.setPlayerPosition(this.players[0], 4, 5);

    this.map[5][5] = this.getRoomByName("Foyer");
    this.setPlayerPosition(this.players[1], 5, 5);

    this.map[6][5] = this.getRoomByName("Grand Staircase");
    this.map[7][4] = this.getRoomByName("Upper Landing");

  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() : void {
    this.mapTable.nativeElement.scrollTop = this.mapTable.nativeElement.scrollHeight / 4;
    this.mapTable.nativeElement.scrollLeft = this.mapTable.nativeElement.scrollHeight / 4;
  }

  ngAfterContentInit() : void {
    
  }

  statRoll(evt: [number, number]) : void {
    console.log("Received value");
        this.diceToRoll = evt[0];
        this.roll();
  }

  setPlayerPosition(player: Player, x: number, y: number) {
    let room = this.map[x][y];
    if (room !== null) {
      player.location = new Pair(x, y);
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
    return this.map[i][j];
  }

  /**Get text representing the floor that the room is on. */
  getFloor(i: number, j: number) {
    let room: Room = this.getRoom(i, j);
    let text = "";

    if (room !== null) {
      if (room.floor === Floor.Start)
        text += "S";
      if ((room.floor & Floor.Basement) > 0)
        text += "B";
      if ((room.floor & Floor.Ground) > 0)
        text += "G";
      if ((room.floor & Floor.Upper) > 0)
        text += "U";
    }
    return text;
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

