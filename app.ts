import * as express from "express"
import * as http from "http"
import * as socketio from "socket.io"
import {Deck, DeckCreateViewModel} from "./models/deck"
import {JoinRoomViewModel} from "./viewModels/socketInputViewModels"
import {JoinedRoomViewModel} from "./viewModels/socketOutputViewModels"
import {NewAttendeeViewModel} from "./viewModels/roomOutputViewModels"
import {SocketInputEvents} from "./events/socketInputEvents"
import {SocketOutputEvents} from "./events/socketOutputEvents"
import {RoomInputEvents} from "./events/roomInputEvents"
import {RoomOutputEvents} from "./events/roomOutputEvents"

const decks: Map<string,Deck> = new Map<string,Deck>();

const app = express();
app.use(express.json());

const server = new http.Server(app);
const io = socketio(server)

app.post('/decks', (req: any, res: any) => {
    let payload: DeckCreateViewModel = req.body;

    let deck_id: string = payload.id;

    if ((decks.has(deck_id))) {
        res.sendStatus(409);
        return;
    }

    let deck = new Deck(payload);
    
    decks.set(deck_id, deck);

    res.json(deck);
});

app.get('/decks/:deck_id', (req: any, res: any) => {
    let deck_id = req.params.deck_id;

    if (!(decks.has(deck_id))) {
        console.log(deck_id + " not found.");
        res.sendStatus(404);
        return;
    }

    let deck = decks.get(deck_id);
    
    res.json(deck);
});

io.on('connection', (socket: socketio.Socket) => {
    socket.on(SocketInputEvents.joinRoom, (joinRoom: JoinRoomViewModel) => {
        const public_user_id = get_public_user_id();

        socket.join(joinRoom.roomCode, () => {

            socket.emit(SocketOutputEvents.joinedRoom, new JoinedRoomViewModel(joinRoom.name, joinRoom.roomCode, public_user_id), () => {
                const newAttendee = new NewAttendeeViewModel(joinRoom.name, joinRoom.roomCode, public_user_id);

                io.to(joinRoom.roomCode).emit(RoomOutputEvents.newAttendee, newAttendee);
            });
        });
    });
    

});

server.listen(8080);

const get_public_user_id = () : string => {
    const min = 1000000000;
    const max = 10000000000;
    return "" + (Math.floor(Math.random() * (max - min)) + min);
}
