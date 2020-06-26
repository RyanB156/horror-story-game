import { Pair } from '../domain/Pair';
import { Floor } from './EnumTypes';

/*
  Controlled by players
  Moves around the map
  Can pick up items

*/
export class Player {
  location: Pair;
  floor: Floor;
  color: string;
  name: string;

  speedLevels: number[];
  mightLevels: number[];
  sanityLevels: number[];
  knowledgeLevels: number[];

  movesRemaining: number;

  speed: number;
  might: number;
  sanity: number;
  knowledge: number;

  private constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
  }

  startMove() : void {
    this.movesRemaining = this.speedLevels[this.speed];
  }

  move() : void {
    this.movesRemaining--;
  }

  hasMovesRemaining() : boolean {
    return this.movesRemaining > 0;
  }

  getFloorName() : string {
    switch (this.floor) {
      case Floor.Basement: return "Basement";
      case Floor.Ground: return "Ground";
      case Floor.Upper: return "Upper";
      default: return "N/A";
    }
  }

  public static madameZostra() : Player {
    let p = new Player("Madame Zostra", "blue");
    p.speed = 3;
    p.speedLevels = [0, 2, 3, 3, 5, 5, 6, 6, 7];
    p.might = 4;
    p.mightLevels = [0, 2, 3, 3, 4, 5, 5, 5, 6];
    p.sanity = 3;
    p.sanityLevels = [0, 4, 4, 4, 5, 6, 7, 8, 8];
    p.knowledge = 4;
    p.knowledgeLevels = [0, 1, 3, 4, 4, 4, 5, 6, 6];
    return p;
  }

  public static vivianLopez() : Player {
    let p = new Player("Vivian Lopez", "blue");
    p.speed = 4;
    p.speedLevels = [0, 3, 4, 4, 4, 4, 6, 7, 8];
    p.might = 3;
    p.mightLevels = [0, 2, 2, 2, 4, 4, 5, 6, 6];
    p.sanity = 3;
    p.sanityLevels = [0, 4, 4, 4, 5, 6, 7, 8, 8];
    p.knowledge = 4;
    p.knowledgeLevels = [0, 4, 5, 5, 5, 5, 6, 6, 7];
    return p;
  }

  public static heatherGranville() : Player {
    let p = new Player("Heather Granville", "pink");
    p.speed = 3;
    p.speedLevels = [0, 3, 3, 4, 5, 6, 6, 7, 8];
    p.might = 3;
    p.mightLevels = [0, 3, 3, 3, 4, 5, 6, 7, 8];
    p.sanity = 3;
    p.sanityLevels = [0, 3, 3, 3, 4, 5, 6, 6, 6];
    p.knowledge = 5;
    p.knowledgeLevels = [0, 2, 3, 3, 4, 5, 6, 7, 8];
    return p;
  }

  public static jennyLeClerc() : Player {
    let p = new Player("Jenny LeClerc", "pink");
    p.speed = 4;
    p.speedLevels = [0, 2, 3, 4, 4, 4, 5, 6, 8];
    p.might = 3;
    p.mightLevels = [0, 3, 4, 4, 4, 4, 5, 6, 8];
    p.sanity = 5;
    p.sanityLevels = [0, 1, 1, 2, 4, 4, 4, 5, 6];
    p.knowledge = 3;
    p.knowledgeLevels = [0, 2, 3, 3, 4, 4, 5, 6, 8];
    return p;
  }

  public static zoeIngstrom() : Player {
    let p = new Player("Zoe Ingstrom", "orange");
    p.speed = 4;
    p.speedLevels = [0, 4, 4, 4, 4, 5, 6, 8, 8];
    p.might = 3;
    p.mightLevels = [0, 2, 2, 3, 3, 4, 4, 6, 7];
    p.sanity = 3;
    p.sanityLevels = [0, 3, 4, 5, 5, 6, 6, 7, 8];
    p.knowledge = 3;
    p.knowledgeLevels = [0, 1, 2, 3, 4, 4, 5, 5, 5];
    return p;
  }

  public static missyDubourde() : Player {
    let p = new Player("Missy Dubourde", "orange");
    p.speed = 3;
    p.speedLevels = [0, 3, 4, 5, 6, 6, 6, 7, 7];
    p.might = 4;
    p.mightLevels = [0, 2, 3, 3, 3, 4, 5, 6, 7];
    p.sanity = 3;
    p.sanityLevels = [0, 1, 2, 3, 4, 5, 5, 6, 7];
    p.knowledge = 4;
    p.knowledgeLevels = [0, 2, 3, 4, 4, 5, 6, 6, 6];
    return p;
  }

  public static professorLongfellow() : Player {
    let p = new Player("Professor Longfellow", "gray");
    p.speed = 4;
    p.speedLevels = [0, 2, 2, 4, 4, 5, 5, 6, 6];
    p.might = 3;
    p.mightLevels = [0, 1, 2, 3, 4, 5, 5, 6, 6];
    p.sanity = 3;
    p.sanityLevels = [0, 1, 3, 3, 4, 5, 5, 6, 7];
    p.knowledge = 5;
    p.knowledgeLevels = [0, 4, 5, 5, 5, 5, 6, 7, 8];
    return p;
  }

  public static fatherRhinehardt() : Player {
    let p = new Player("Father Rhinehardt", "gray");
    p.speed = 3;
    p.speedLevels = [0, 2, 3, 3, 4, 5, 6, 7, 7];
    p.might = 3;
    p.mightLevels = [0, 1, 2, 2, 4, 4, 5, 5, 7];
    p.sanity = 5;
    p.sanityLevels = [0, 3, 4, 5, 5, 6, 7, 7, 8];
    p.knowledge = 4;
    p.knowledgeLevels = [0, 1, 3, 3, 4, 5, 6, 6, 8];
    return p;
  }

  public static oxBellows() : Player {
    let p = new Player("Ox Bellows", "red");
    p.speed = 5;
    p.speedLevels = [0, 2, 2, 2, 3, 4, 5, 5, 6];
    p.might = 3;
    p.mightLevels = [0, 4, 5, 5, 6, 6, 7, 8, 8];
    p.sanity = 3;
    p.sanityLevels = [0, 2, 2, 3, 4, 5, 5, 6, 7];
    p.knowledge = 3;
    p.knowledgeLevels = [0, 2, 2, 3, 3, 5, 5, 6, 6];
    return p;
  }

  public static darrinWilliams() : Player {
    let p = new Player("Darrin Williams", "red");
    p.speed = 5;
    p.speedLevels = [0, 4, 4, 4, 5, 6, 7, 7, 8];
    p.might = 3;
    p.mightLevels = [0, 2, 3, 3, 4, 5, 6, 6, 7];
    p.sanity = 3;
    p.sanityLevels = [0, 1, 2, 3, 4, 5, 5, 5, 7];
    p.knowledge = 3;
    p.knowledgeLevels = [0, 2, 3, 3, 4, 5, 5, 5, 7];
    return p;
  }

  public static brandonJaspers() : Player {
    let p = new Player("Brandon Jaspers", "green");
    p.speed = 3;
    p.speedLevels = [0, 3, 4, 4, 4, 5, 6, 7, 8];
    p.might = 4;
    p.mightLevels = [0, 2, 3, 3, 4, 5, 6, 6, 7];
    p.sanity = 4;
    p.sanityLevels = [0, 3, 3, 3, 4, 5, 6, 7, 8];
    p.knowledge = 3;
    p.knowledgeLevels = [0, 1, 3, 3, 5, 5, 6, 6, 7];
    return p;
  }

  public static peterAkimoto() : Player {
    let p = new Player("Peter Akimoto", "green");
    p.speed = 4;
    p.speedLevels = [0, 3, 3, 3, 4, 6, 6, 7, 7];
    p.might = 3;
    p.mightLevels = [0, 2, 3, 3, 4, 5, 5, 6, 8];
    p.sanity = 4;
    p.sanityLevels = [0, 3, 4, 4, 4, 5, 6, 6, 7];
    p.knowledge = 3;
    p.knowledgeLevels = [0, 3, 4, 4, 5, 6, 7, 7, 8];
    return p;
  }

}