import {Card} from "../models/card"
import {Mappings} from "../models/mappings"

export class JoinRoomViewModel {
    name: string;
    roomCode: string;
}

export class DeckViewModel {
    id: string;
    draw: Card[];
    discard: Card[];
}

export class DeckCreateViewModel {
    id: string;
    mappings: Mappings;
}

export class AddCardViewModel {
    deckId: string;
    card: Card;
}
