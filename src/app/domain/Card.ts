
import { CardType } from './EnumTypes';

// TODO: Find a way to have cards make/allow the player to perform certain actions, place tokens in rooms, add buffs or debuffs to rooms.


export class Card {
  title: string;
  dialogue: string;
  description: string;
  cardType: CardType;

  private constructor(title: string, dialogue: string, description: string, cardType: CardType) {
    this.title = title;
    this.dialogue = dialogue;
    this.description = description;
    this.cardType = cardType;
  }

  public static makeEvent(title: string, dialogue: string, description: string) : Card {
    return new Card(title, dialogue, description, CardType.Event);
  }

  public static makeItem(title: string, dialogue: string, description: string) : Card {
    return new Card(title, dialogue, description, CardType.Event);
  }

  public static makeOmen(title: string, dialogue: string, description: string) : Card {
    return new Card(title, dialogue, description, CardType.Event);
  }
}
