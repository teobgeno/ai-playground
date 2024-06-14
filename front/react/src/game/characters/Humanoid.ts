import Phaser, { Physics } from "phaser";
import { Task } from "../actions/types";
import StateMachine from "./StateMachine";
import { CharacterInventory } from "./CharacterInventory";

export class Humanoid extends Physics.Arcade.Sprite {
    public id: string;
    //private stamina: number;
    protected tasks: Array<Task> = [];
    protected stateMachine: StateMachine;
    protected characterInventory: CharacterInventory;
    protected convGuid: string;
    public currentTask: Task | undefined;
    public isNpc: boolean;

    constructor(scene: Phaser.Scene, texture: string, id: string) {
        super(scene, 0, 0, texture);
        this.scene = scene;
        this.id = id;
        this.isNpc = this.id === "hero" ? false : true;
        this.stateMachine = new StateMachine(this, this.id);
        this.characterInventory = new CharacterInventory();
    }
    protected createAnimation(
        key: string,
        texture: string,
        start: number,
        end: number,
        rate: number | null,
        repeat: boolean | null,
        revert: any
    ) {
        rate = rate || 10;
        const config = {
            key: key,
            frames: this.scene.anims.generateFrameNumbers(texture, {
                start: start,
                end: end,
            }),
            frameRate: rate,
            repeat: 0,
        };
        if (repeat) config.repeat = -1;
        //if (revert) config.frames.push({ key: texture, frame: start });
        this.scene.anims.create(config);
    }

    public getId() {
        return this.id;
    }

    public getConvGuid() {
        return this.convGuid;
    }

    public setConvGuid(convGuid: string) {
        this.convGuid = convGuid;
    }

    public getStamina() {}

    public setStamina() {}

    public setCharState(state: string) {
        this.stateMachine.setState(state);
    }

    public getInventory() {
        return this.characterInventory;
    }

    public addTask(task: Task) {
        this.tasks.push(task);
    }

    public getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }
}
