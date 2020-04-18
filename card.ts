import {Suit} from "./suit"
import {Value} from "./value"
import {ActionModel} from "./action"

export class Card {
    suit: Suit;
    value: Value;
    action: ActionModel;

    constructor(suit: Suit, value: Value, action: ActionModel) {
        this.suit = suit;
        this.value = value;
        this.action = action;
    }
}