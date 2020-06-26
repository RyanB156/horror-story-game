import { Component, OnInit, Input, ViewChild, ElementRef, ContentChild, AfterViewInit } from '@angular/core';
import { Room } from '../domain/Room';

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
  @Input() reachableRooms: Set<Room>;

  // Floor component needs [rows, cols, {basement, ground, upper}Map, reachableRooms

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() : void {
    this.mapTable.nativeElement.scrollTop = this.mapTable.nativeElement.scrollHeight / 4;
    this.mapTable.nativeElement.scrollLeft = this.mapTable.nativeElement.scrollHeight / 4;
  }

}
