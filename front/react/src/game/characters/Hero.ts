import { GridEngine } from "grid-engine";
import { CharacterController } from "./CharacterController";
import { CharacterInventory } from "./CharacterInventory";
import { TaskStatus } from "../actions/types";
import { Humanoid } from "./Humanoid";

export class Hero extends Humanoid {
    private gridEngine: GridEngine;
    private characterController: CharacterController;
    private characterInventory: CharacterInventory;

    constructor(
        scene: Phaser.Scene,
        texture: string,
        gridEngine: GridEngine,
        //map: Tilemaps.Tilemap
        id: string
    ) {
        super(scene, texture, id);
        this.gridEngine = gridEngine;
        this.characterController = new CharacterController(
            this.scene,
            this.gridEngine,
            this.stateMachine,
            this.id
        );
        this.characterInventory = new CharacterInventory();
    }

    public init() {
        this.createMovementAnimations();
        this.createHumanoidAnimations(this.id);
        this.getBody().setSize(32, 64);
        //this.getBody().setCollideWorldBounds(true);
    }

    public getInventory() {
        return this.characterInventory;
    }

    update(dt: number): void {
        this.characterController.update(dt);
        if (
            (this.tasks.length > 0 && !this.currentTask) ||
            (this.currentTask &&
                this.currentTask.getStatus() === TaskStatus.Completed)
        ) {
            this.currentTask = this.tasks.shift();
            if (this.currentTask) {
                this.currentTask.start();
            }
        }
    }

    private createMovementAnimations() {
        this.createAnimation("right", this.id, 143, 147, 15, true, true);
        this.createAnimation("up", this.id, 104, 112, 15, true, true);
        this.createAnimation("down", this.id, 130, 138, 15, true, true);
        this.createAnimation("left", this.id, 117, 121, 15, true, true);
    }

    private createHumanoidAnimations(key: string) {
        const texture = key;
        this.createAnimation("attack_right", texture, 195, 200, 15, true, true);
        this.createAnimation(
            key + "_attack_down",
            texture,
            182,
            187,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_attack_left",
            texture,
            169,
            174,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_attack_up",
            texture,
            156,
            161,
            15,
            false,
            true
        );

        this.createAnimation(
            key + "_bow_right",
            texture,
            247,
            259,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_bow_down",
            texture,
            234,
            246,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_bow_left",
            texture,
            221,
            233,
            15,
            false,
            true
        );
        this.createAnimation(
            key + "_bow_up",
            texture,
            208,
            220,
            15,
            false,
            true
        );

        this.createAnimation(
            key + "_rest_down",
            texture,
            130,
            130,
            null,
            null,
            null
        );
        this.createAnimation(
            key + "_rest_left",
            texture,
            117,
            117,
            null,
            null,
            null
        );
        this.createAnimation(
            key + "_rest_right",
            texture,
            143,
            143,
            null,
            null,
            null
        );
        this.createAnimation(
            key + "_rest_up",
            texture,
            104,
            104,
            null,
            null,
            null
        );
    }

    // private createAnimation(
    //     key: string,
    //     texture: string,
    //     start: number,
    //     end: number,
    //     rate: number | null,
    //     repeat: boolean | null,
    //     revert: any
    // ) {
    //     rate = rate || 10;
    //     const config = {
    //         key: key,
    //         frames: this.scene.anims.generateFrameNumbers(texture, {
    //             start: start,
    //             end: end,
    //         }),
    //         frameRate: rate,
    //         repeat: 0,
    //     };
    //     if (repeat) config.repeat = -1;
    //     //if (revert) config.frames.push({ key: texture, frame: start });
    //     this.scene.anims.create(config);
    // }

    public getStopFrame(direction: string) {
        switch (direction) {
            case "up":
                return 104;
            case "right":
                return 143;
            case "down":
                return 130;
            case "left":
                return 117;
        }
        return -1;
    }

    public startTalk() {
        console.log("ok talk hero");
        //EventBus.emit("on-player-talk-start", {});
    }

    public sendMessage() {}

    // public getBody(): Physics.Arcade.Body {
    //     return this.body as Physics.Arcade.Body;
    // }
}
