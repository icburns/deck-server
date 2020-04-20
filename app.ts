import * as express from "express"
import * as http from "http"
import * as socketio from "socket.io"
import {Deck} from "./models/deck"
import {JoinRoomViewModel, DeckCreateViewModel, AddCardViewModel} from "./viewModels/socketInputViewModels"
import {JoinedRoomViewModel} from "./viewModels/socketOutputViewModels"
import {NewAttendeeViewModel} from "./viewModels/roomOutputViewModels"
import {SocketInputEvents} from "./events/socketInputEvents"
import {SocketOutputEvents} from "./events/socketOutputEvents"
import {RoomOutputEvents} from "./events/roomOutputEvents"

const decks: Map<string,Deck> = new Map<string,Deck>();

const app = express();
app.use(express.json());

const server = new http.Server(app);
const io = socketio(server)

io.on('connection', (socket: socketio.Socket) => {
    socket.on(SocketInputEvents.joinRoom, (joinRoom: JoinRoomViewModel) => {
        const publicUserId = getPublicUserId();

        socket.join(joinRoom.roomCode, () => {

            socket.emit(SocketOutputEvents.joinedRoom, new JoinedRoomViewModel(joinRoom.name, joinRoom.roomCode, publicUserId), () => {
                console.log(joinRoom.name + " joined " + joinRoom.roomCode);

                const newAttendee = new NewAttendeeViewModel(joinRoom.name, joinRoom.roomCode, publicUserId);

                io.to(joinRoom.roomCode).emit(RoomOutputEvents.newAttendee, newAttendee);
            });
        });
    });

    socket.on(SocketInputEvents.getDeck, (deckId: string, cb: Function) => {
        if (!(decks.has(deckId))) {
            console.log(deckId + " not found.");
            cb(null);
        }
    
        let deck = decks.get(deckId);
        
        cb(deck);
    });

    socket.on(SocketInputEvents.postDeck, (deckCreateViewModel: DeckCreateViewModel, cb) => {
        if ((decks.has(deckCreateViewModel.id))) {
            return null;
        }

        let deck = new Deck(deckCreateViewModel);
        
        decks.set(deck.id, deck);
    
        cb(deck);
    });

    socket.on(SocketInputEvents.drawCard, (deckId: string, cb) => {
        if ((decks.has(deckId))) {
            return null;
        }
    
        let deck = decks.get(deckId);

        deck.drawCard();
    
        cb(deck);
    });

    socket.on(SocketInputEvents.addCard, (addCardViewModel: AddCardViewModel, cb) => {
        if ((decks.has(addCardViewModel.deckId))) {
            return null;
        }
    
        let deck = decks.get(addCardViewModel.deckId);

        deck.addCard(addCardViewModel.card);
    
        cb(deck);
    });


});

server.listen(8080);

const getPublicUserId = () : string => {
    const min = 1000000000;
    const max = 10000000000;
    return "" + (Math.floor(Math.random() * (max - min)) + min);
}
