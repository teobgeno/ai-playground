import Phaser, { Physics } from "phaser";
import { Order, Task } from "../actions/types";
import StateMachine from "./StateMachine";
import { CharacterInventory } from "./CharacterInventory";

export class Humanoid extends Physics.Arcade.Sprite {
    public id: number;
    public idTag: string;
    protected charName: string;
    public scene: Phaser.Scene;
    protected orders: Array<Order> = [];
    protected tasks: Array<Task> = [];
    protected stateMachine: StateMachine;
    protected characterInventory: CharacterInventory;
    protected convId: number;
    protected stamina:number = 100;
    public currentTask: Task | undefined;
    public isNpc: boolean;

    constructor(scene: Phaser.Scene, texture: string, id: number, idTag: string, charName: string) {
        super(scene, 0, 0, texture);
        this.scene = scene;
        this.id = id;
        this.idTag = idTag;
        this.charName = charName;
        this.isNpc = this.idTag === "hero" ? false : true;
        this.stateMachine = new StateMachine(this, this.idTag);
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

    public getIdTag() {
        return this.idTag;
    }
    public getName() {
        return this.charName;
    }
    public getStamina() {
        return this.stamina;
    }

    public increaseStamina(staminaAmount: number) {
        this.stamina = this.stamina + staminaAmount;
    }

    public decreaseStamina(staminaAmount: number) {
        this.stamina = this.stamina - staminaAmount;
    }

    public setCharState(state: string) {
        this.stateMachine.setState(state);
    }

    public getInventory() {
        return this.characterInventory;
    }

    public addOrder(order: Order) {
        this.orders.push(order);
    }

    public addTask(task: Task) {
        this.tasks.push(task);
    }

    public getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }
}
