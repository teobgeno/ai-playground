import { Input } from "phaser";
import { Direction, GridEngine } from "grid-engine";
import StateMachine from "./StateMachine";

export default class CharacterController {
    private scene: Phaser.Scene;
    private sprite: Phaser.Physics.Arcade.Sprite;
    private gridEngine: GridEngine;
    private stateMachine: StateMachine;
    private keyW: Input.Keyboard.Key;
    private keyA: Input.Keyboard.Key;
    private keyS: Input.Keyboard.Key;
    private keyD: Input.Keyboard.Key;
    private id:string;

    constructor(
        scene: Phaser.Scene,
        sprite: Phaser.Physics.Arcade.Sprite,
        gridEngine: GridEngine,
        id: string
    ) {
        this.scene = scene;
        this.sprite = sprite;
        this.gridEngine = gridEngine;
        this.id = id;
        this.stateMachine = new StateMachine(this, "hero");

        if (this.scene.input.keyboard) {
            this.keyW = this.scene.input.keyboard.addKey("W");
            this.keyA = this.scene.input.keyboard.addKey("A");
            this.keyS = this.scene.input.keyboard.addKey("S");
            this.keyD = this.scene.input.keyboard.addKey("D");
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
            .setState("idle");
    }

    update(dt: number) {
        this.stateMachine.update(dt);
    }

    private idleOnEnter() {
        //this.sprite.play("player-idle");
    }

    private idleOnUpdate() {
        if (this.keyW?.isDown || this.keyA?.isDown || this.keyS?.isDown || this.keyD?.isDown) {
            this.stateMachine.setState('walk')
        }
    }
    private walkOnEnter() {
        
    }
    private walkOnUpdate() {
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
            this.stateMachine.setState('idle')
        }
    }

    private walkOnExit() {}
}
