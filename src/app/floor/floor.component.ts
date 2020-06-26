import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Room } from '../domain/Room';
import { Player } from '../domain/Player';

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
  @Input() reachableRooms: Set<Room>;
  @Output() roomClick: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

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
    this.roomClick.emit([x, y]);
  }

}
