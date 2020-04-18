import * as express from "express"
import * as http from "http"
import * as socketio from "socket.io"
import {Deck, DeckCreateViewModel} from "./deck"

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
    socket.emit("state", "connect");

    socket.on("joinRoom", (joinRoom: any) => {
        console.log(joinRoom);
        socket.join(joinRoom, () => {
            io.to(joinRoom).emit("state", "joined");
        });
    });
    

});

server.listen(8080);