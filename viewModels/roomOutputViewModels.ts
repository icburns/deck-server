export class NewAttendeeViewModel {
    name: string;
    roomCode: string;
    public_user_id: string;

    constructor(name: string, roomCode: string, public_user_id: string) {
        this.name = name;
        this.roomCode = roomCode;
        this.public_user_id = public_user_id;
    }
}
