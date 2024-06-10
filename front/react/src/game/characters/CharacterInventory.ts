import { Input } from "phaser";
import { Direction, GridEngine } from "grid-engine";
import StateMachine from "./StateMachine";

export default class CharacterInventory {
    private scene: Phaser.Scene;
    private gridEngine: GridEngine;
    private keyW: Input.Keyboard.Key;
    private keyA: Input.Keyboard.Key;
    private keyS: Input.Keyboard.Key;
    private keyD: Input.Keyboard.Key;
    private stateMachine: StateMachine;
    private id: string;

    constructor(
        scene: Phaser.Scene,
        gridEngine: GridEngine,
        stateMachine: StateMachine,
        id:string
    ) {
        this.scene = scene;
        this.gridEngine = gridEngine;
        this.stateMachine = stateMachine;
        this.id = id;
        if (this.scene.input.keyboard) {
            this.keyW = this.scene.input.keyboard.addKey("W", false);
            this.keyA = this.scene.input.keyboard.addKey("A", false);
            this.keyS = this.scene.input.keyboard.addKey("S", false);
            this.keyD = this.scene.input.keyboard.addKey("D", false);
        }

        this.stateMachine
            .addState("idle", {
                onEnter: this.idleOnEnter,
                onUpdate: this.idleOnUpdate,
            })
            .addState("walk", {
                onEnter: this.walkOnEnter,
                onUpdate: this.walkOnUpdate,
                onExit: this.walkOnExit,
            })
            .addState("talk", {})
            .setState("idle");
    }

    update(dt: number) {
        this.stateMachine.update(dt);
    }

    private idleOnEnter() {
        //this.sprite.play("player-idle");
    }

    private idleOnUpdate = () => {
        if (this.keyW?.isDown || this.keyA?.isDown || this.keyS?.isDown || this.keyD?.isDown) {
            this.stateMachine.setState('walk')
        }
    }
    private walkOnEnter() {
        
    }
    private walkOnUpdate = () => {
        if (this.keyW?.isDown) {
            this.gridEngine.move(this.id, Direction.UP);
        }
        else if (this.keyA?.isDown) {
            this.gridEngine.move(this.id, Direction.LEFT);
        }
        else if (this.keyS?.isDown) {
            this.gridEngine.move(this.id, Direction.DOWN);
        }
        else if (this.keyD?.isDown) {
            this.gridEngine.move(this.id, Direction.RIGHT);
        } else {
            if(!this.gridEngine.isMoving(this.id)) {
                this.stateMachine.setState('idle')
            }
        }
        //console.log(this.gridEngine.isMoving(this.id))
    }

    private walkOnExit() {}
}
