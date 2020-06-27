import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Room } from '../domain/Room';
import { Player } from '../domain/Player';
import { Point } from '../domain/Point';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnInit, AfterViewInit {
  @ViewChild("mapTable") mapTable: ElementRef;
  @Input() rows: number[];
  @Input() cols: number[];
  @Input() map: Room[][];
  @Input() players: Player[];
  @Input() reachableRooms: Set<string>;
  @Output() roomClick: EventEmitter<Point> = new EventEmitter<Point>();

  // Floor component needs [rows, cols, {basement, ground, upper}Map, reachableRooms

  constructor() { 
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() : void {
    this.mapTable.nativeElement.scrollTop = this.mapTable.nativeElement.scrollHeight / 4;
    this.mapTable.nativeElement.scrollLeft = this.mapTable.nativeElement.scrollHeight / 4;
  }

  playersHere(x: number, y: number) {
    return this.players.filter(p => p.location.x === x && p.location.y === y);
  }

  /**Let the parent component know that one of the rooms was clicked. */
  onRoomClick(x: number, y: number) : void {

    console.log(`Clicked ${x}, ${y}`);
    console.log(this.map[x][y]);
    if (this.map[x][y] !== undefined && this.map[x][y].isNewRoom) {
      console.log("Rotating");
      this.map[x][y].rotate();
    } else {
      console.log("Emitting");
      this.roomClick.emit(new Point(x, y));
    }
  }

  doneRotatingRoom(x: number, y: number) : void {
    this.map[x][y].isNewRoom = false;
  }

  isReachable(x: number, y: number) : boolean {
    return this.reachableRooms.has(JSON.stringify(new Point(x, y)));
  }

}
