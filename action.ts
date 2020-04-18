export class ActionModel {
    name: Action;
    reps: number;
    duration: number;
    rest: number;

    constructor(name: Action, reps?: number, duration?: number, rest?: number) {
        this.name = name;
        this.reps = reps;
        this.duration = duration;
        this.rest = rest;
    }
}

export enum Action {
    BackLunge = "BackLunge",
    Pushup = "Pushup",
    Bridge = "Bridge",
    Squat = "Squat",
    MountainClimber = "MountainClimber",
    BodySaw = "BodySaw",
    FlutterKick = "FlutterKick",
    ReachThrough = "ReachThrough",
    SquatJump = "SquatJump"
}