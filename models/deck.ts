import {Card} from "./card"
import { Value } from "./value";
import { Suit } from "./suit";
import { DeckCreateViewModel } from "../viewModels/socketInputViewModels"

export class Deck {
    id: string;
    active: Card;
    draw: Card[];
    discard: Card[];

    constructor(createModel: DeckCreateViewModel) {
        this.draw = [];
        this.discard = [];

        for (let m in createModel.mappings) {
            let action = (createModel.mappings as any)[m];
            if (m in Suit && m !== Suit.joker) {
                for (let v = 2; v <= 10; v++) {
                    action.reps = v;
                    this.draw.push(new Card(<Suit>m, <Value>v, action));
                }
            } else {
                for (let s in Suit) {
                    if (s !== Suit.joker && m !== Value.joker) {
                        this.draw.push(new Card(<Suit>s, <Value>m, action));
                    }
                }
            }
        }

        this.draw.push(new Card(Suit.joker, Value.joker, createModel.mappings.joker));
        this.draw.push(new Card(Suit.joker, Value.joker, createModel.mappings.joker));

        this.shuffle();
    }

    shuffle = () => {
        //http://stackoverflow.com/a/2450976/1037948
        let temp, j, i = this.draw.length;
        while (--i) {
            j = ~~(Math.random() * (i + 1));
            temp = this.draw[i];
            this.draw[i] = this.draw[j];
            this.draw[j] = temp;
        }
    }

    drawCard = () => {
        if (this.draw.length <= 0) {
            return;
        }

        if (this.active) {
            this.discard.push(this.active);
        }

        this.active = this.draw.pop();

    }

    addCard = (card: Card) => {
        this.draw.push(card);
    }

}
