import { Game } from "../scenes/Game";
import { GridEngine } from "grid-engine";
import { Humanoid } from "./Humanoid";
import { InteractiveItem } from "../items/InteractiveItem";
import { SpriteItem } from "../items/SpriteItem";
import { MapObjectInteractable } from "../core/types";
import { CharacterState, Character } from "./types";
import { OrderStatus } from "../actions/types";
export class Npc extends Humanoid implements Character, MapObjectInteractable {
    private gridEngine: GridEngine;
    private interactive: InteractiveItem;
    public sprites: Array<SpriteItem> = [];
    protected orderPointer: number = 0;

    constructor(
        scene: Phaser.Scene,
        texture: string,
        gridEngine: GridEngine,
        id: number,
        idTag: string,
        charName: string
    ) {
        super(scene, texture, id, idTag, charName);
        this.gridEngine = gridEngine;

        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: texture, frame: id },
                {
                    x: this.x,
                    y: this.y,
                    pixelX: 0,
                    pixelY: 0,
                },
                16,
                16,
                true
            )
        );
        this.sprites[0].addExisting(this);

        this.stateMachine
            .addState(CharacterState.IDLE, {})
            .addState(CharacterState.WALK, {})
            .addState(CharacterState.AUTOWALK, {})
            .addState(CharacterState.TALK, {})
            .addState(CharacterState.TILL, {})
            .setState(CharacterState.IDLE);
    }

    public init() {
        
        this.interactive = new InteractiveItem();
        this.interactive.setSprites(this.sprites[0]);
        this.interactive.setSelfInteraction(true);
        this.interactive.setScene(this.scene);
        this.interactive.setInteractiveObjectIds([]);
        this.interactive.setInteractionResult(() => {
            this.interactWithItem();
        });
        this.interactive.startInteraction();
        this.interactive.setSelfInteractionCursor('assets/cursors/axe.cur')
    }

    public getInteractive() {
        return this.interactive;
    }

    public interactWithItem() {
       (this.scene as Game).addPlayerTask("conversation", this);
    }

    update(dt: number) {
        this.stateMachine.update(dt);
        this.updateOrders();
    }


    private updateOrders() {
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
