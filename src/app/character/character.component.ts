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
  @Input() active: boolean;
  /**Emits the number of dice to roll and the index of the player. */
  @Output() statRoll: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();
  @Output() finished: EventEmitter<any> = new EventEmitter<any>();
  

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
    if (this.active) {
      console.log("Emitting Physical Roll");
      this.statRoll.emit([Math.max(this.player.speedLevels[this.player.speed], this.player.mightLevels[this.player.might]), this.index]); 
    }
  }

  onMentalRoll() {
    if (this.active) {
      console.log("Emitting Mental Roll");
      this.statRoll.emit([Math.max(this.player.sanityLevels[this.player.sanity], this.player.knowledgeLevels[this.player.knowledge]), this.index]); 
    }
  }

  onFinished() {
    if (this.active) {
      this.finished.emit(); 
    }
  }

}
