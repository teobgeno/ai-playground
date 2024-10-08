import { Input } from "phaser";
import { EventBus } from "../EventBus";
import { Direction, GridEngine } from "grid-engine";
import StateMachine from "./StateMachine";
import { CharacterState } from "./types";


export class CharacterController {
    private scene: Phaser.Scene;
    private gridEngine: GridEngine;
    private keyW: Input.Keyboard.Key;
    private keyA: Input.Keyboard.Key;
    private keyS: Input.Keyboard.Key;
    private keyD: Input.Keyboard.Key;
    private keyESC: Input.Keyboard.Key;
    private keyI: Input.Keyboard.Key;
    private stateMachine: StateMachine;
    private idTag: string;

    constructor(
        scene: Phaser.Scene,
        gridEngine: GridEngine,
        stateMachine: StateMachine,
        idTag: string
    ) {
        this.scene = scene;
        this.gridEngine = gridEngine;
        this.stateMachine = stateMachine;
        this.idTag = idTag;
        if (this.scene.input.keyboard) {
            this.keyW = this.scene.input.keyboard.addKey("W", false);
            this.keyA = this.scene.input.keyboard.addKey("A", false);
            this.keyS = this.scene.input.keyboard.addKey("S", false);
            this.keyD = this.scene.input.keyboard.addKey("D", false);
            this.keyESC = this.scene.input.keyboard.addKey("ESC", false);
            this.keyI = this.scene.input.keyboard.addKey("I", false);
        }

        this.stateMachine
            .addState(CharacterState.IDLE, {
                onEnter: this.idleOnEnter,
                onUpdate: this.idleOnUpdate,
            })
            .addState(CharacterState.WALK, {
                onEnter: this.walkOnEnter,
                onUpdate: this.walkOnUpdate,
                onExit: this.walkOnExit,
            })
            .addState(CharacterState.AUTOWALK, {})
            .addState(CharacterState.TALK, {})
            .addState(CharacterState.TILL, {})
            .setState(CharacterState.IDLE);
    }

    update(dt: number) {
        this.gameControllsUpdate();
        this.stateMachine.update(dt);
    }

    private gameControllsUpdate() {
        if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {
            EventBus.emit("on-character-controller-esc-key", {});
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyI)) {
            console.log(this.stateMachine.getCurrentStateName())
            if(this.stateMachine.getCurrentStateName() === CharacterState.IDLE) {
                EventBus.emit("on-character-controller-i-key", {});
            }
        }
    }

    private idleOnEnter() {
        //this.sprite.play("player-idle");
    }

    private idleOnUpdate = () => {
        if (
            this.keyW?.isDown ||
            this.keyA?.isDown ||
            this.keyS?.isDown ||
            this.keyD?.isDown
        ) {
            this.stateMachine.setState("walk");
        }
    };
    private walkOnEnter() {}
    private walkOnUpdate = () => {
        if(this.keyS?.isDown && this.keyD?.isDown) {
            this.gridEngine.move(this.idTag, Direction.DOWN_RIGHT);
        }
        else if(this.keyS?.isDown && this.keyA?.isDown) {
            this.gridEngine.move(this.idTag, Direction.DOWN_LEFT);
        }
        else if(this.keyW?.isDown && this.keyD?.isDown) {
            this.gridEngine.move(this.idTag, Direction.UP_RIGHT);
        }
        else if(this.keyW?.isDown && this.keyA?.isDown) {
            this.gridEngine.move(this.idTag, Direction.UP_LEFT);
        }
        else if (this.keyW?.isDown) {
            this.gridEngine.move(this.idTag, Direction.UP);
        } else if (this.keyA?.isDown) {
            this.gridEngine.move(this.idTag, Direction.LEFT);
        } else if (this.keyS?.isDown) {
            this.gridEngine.move(this.idTag, Direction.DOWN);
        } else if (this.keyD?.isDown) {
            this.gridEngine.move(this.idTag, Direction.RIGHT);
        } else {
            if (!this.gridEngine.isMoving(this.idTag)) {
                this.stateMachine.setState("idle");
            }
        }
        //console.log(this.gridEngine.isMoving(this.id))
    };

    private walkOnExit() {}
}
