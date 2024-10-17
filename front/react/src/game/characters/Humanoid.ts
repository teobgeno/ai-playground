import Phaser, { Physics } from "phaser";
import { Order, Task, OrderStatus } from "../actions/types";
import StateMachine from "./StateMachine";
import { CharacterInventory } from "./CharacterInventory";

export class Humanoid extends Physics.Arcade.Sprite {
    public id: number;
    public idTag: string;
    protected charName: string;
    public scene: Phaser.Scene;
    protected orders: Array<Order> = [];
    protected currentOrder: Order | undefined;
    protected orderPointer: number = 0;
    protected tasks: Array<Task> = [];
    public currentTask: Task | undefined;
    protected stateMachine: StateMachine;
    protected characterInventory: CharacterInventory;
    protected convId: number;
    protected stamina:number = 100;
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

    public updateOrdersQueue() {
        if (
            (this.orders.length > 0 && !this.currentOrder) ||
            (this.currentOrder && this.currentOrder.getStatus() !== OrderStatus.Running)
        ) {
            this.currentOrder = this.orders[this.orderPointer];
        }
        // run order if is not completed or canceled
        if (this.currentOrder && this.currentOrder.getStatus() !== OrderStatus.Completed) {
            this.currentOrder.update();
        }

        //if reccuring order and waiting seek to next order.
        if (this.currentOrder && this.currentOrder.getStatus() === OrderStatus.WaitingNextReccur) {
            this.orderPointer = this.orderPointer < this.orders.length ? this.orderPointer + 1 : 0;
        }

        //delete order if is completed/completed from canceled. Keep orderPointer to the same value as array is length -1.
        if (this.currentOrder && this.currentOrder.getStatus() === OrderStatus.Completed) {
            this.currentOrder = undefined;
            this.orders.shift();
        }

        // if(this.currentOrder && this.currentOrder.getStatus() === OrderStatus.Canceled) {
        //     this.currentOrder.cancel();
        // }
    }
}
