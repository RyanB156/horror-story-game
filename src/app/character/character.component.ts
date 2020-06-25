import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player } from '../domain/Player';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
  @Input() player: Player;
  @Input() index: number;
  /**Emits the number of dice to roll and the index of the player. */
  @Output() physicalRoll: EventEmitter<[number, number]>;
  /**Emits the number of dice to roll and the index of the player. */
  @Output() mentalRoll: EventEmitter<[number, number]>;

  constructor() { 
    
  }

  ngOnInit(): void {
  }

  isSpeedSelected(i: number) : string {
    return i === this.player.speed ? "selected" : "none";
  }

  isMightSelected(i: number) : string {
    return i === this.player.might ? "selected" : "none";
  }

  isSanitySelected(i: number) : string {
    return i === this.player.sanity ? "selected" : "none";
  }

  isKnowledgeSelected(i: number) : string {
    return i === this.player.knowledge ? "selected" : "none";
  }

  onPhysicalRoll() {
    this.physicalRoll.emit([Math.max(this.player.speed, this.player.might), this.index]);
  }

  onMentalRoll() {
    this.physicalRoll.emit([Math.max(this.player.sanity, this.player.knowledge), this.index]);
  }

}
