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
    public currentOrder: Order | undefined;
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
        if(this.orders.length === 1) {
            this.updateOrdersQueue();
        }
    }

    public addTask(task: Task) {
        this.tasks.push(task);
    }

    public getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

    // Initialized = 1,
    // Running = 2,
   
    // Rollback = 4,
    // Canceled = 5,
    // Paused = 6,

     // Completed = 3,
    // WaitingNextReccur = 7


    public updateOrdersQueue() {
        // Ensure there's an order to process and the current order isn't running
        if (this.orders.length > 0 && (!this.currentOrder || this.currentOrder.getStatus() !== OrderStatus.Running)) {
            this.currentOrder = this.orders[this.orderPointer];
        }
    
        if (!this.currentOrder) return; // Exit early if no current order
    
        const currentStatus = this.currentOrder.getStatus();
    
        switch (currentStatus) {
            case OrderStatus.Initialized:
            case OrderStatus.Running:
                this.currentOrder.update();
                break;
    
            case OrderStatus.WaitingNextReccur:
                this.handleRecurringOrder();
                break;
    
            case OrderStatus.Completed:
                this.handleCompleteOrder();
                break;
        }
    }
    
    private handleRecurringOrder() {
        if (this.currentOrder && this.currentOrder.canContinueReccur()) {
            this.currentOrder.update();
        } else {
            // Move to next order or reset pointer
            if(this.hasOrdersToRun()) {
                this.orderPointer = (this.orderPointer + 1) % this.orders.length;
                this.updateOrdersQueue();
            }
        }
    }
    
    private handleCompleteOrder() {

        this.orders = this.orders.filter(x=> x.getStatus() !== OrderStatus.Completed);
        if(this.hasOrdersToRun()) {
            this.orderPointer = 0;
            this.updateOrdersQueue();
        }
    }

    private hasOrdersToRun() {
        return this.orders.find(x=> x.getStatus() === OrderStatus.Initialized) ? true : false;
    }

}
