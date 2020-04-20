export class NewAttendeeViewModel {
    name: string;
    roomCode: string;
    publicUserId: string;

    constructor(name: string, roomCode: string, publicUserId: string) {
        this.name = name;
        this.roomCode = roomCode;
        this.publicUserId = publicUserId;
    }
}
