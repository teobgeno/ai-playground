import { GridEngine } from "grid-engine";
import { CharacterController } from "./CharacterController";
import { TaskStatus } from "../actions/types";
import { Humanoid } from "./Humanoid";
import { EventBus } from "../EventBus";

export class Hero extends Humanoid {
    private gridEngine: GridEngine;
    private characterController: CharacterController;
    
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
        this.characterController = new CharacterController(
            this.scene,
            this.gridEngine,
            this.stateMachine,
            this.idTag
        );
       
        EventBus.on("on-character-controller-esc-key", () => {
            this.tasks.forEach((task) => task.setStatus(TaskStatus.Canceled));
            if( this.currentTask) {
                this.currentTask.setStatus(TaskStatus.Canceled);
            }
        });
    }

    public init() {
        this.createMovementAnimations();
        this.createHumanoidAnimations(this.getIdTag());
        this.getBody().setSize(32, 64);
    }

    update(dt: number): void {
        this.characterController.update(dt);
        this.updateTasksQueue();
        //https://www.html5gamedevs.com/topic/40592-how-do-i-call-a-callback-function-when-two-objects-stop-overlapping/
        //console.log(this.getBody().embedded)
    }

    private updateTasksQueue() {
        if (
            (this.tasks.length > 0 && !this.currentTask) ||
            (this.currentTask &&
                this.currentTask.getStatus() === TaskStatus.Completed)
        ) {
            this.currentTask = this.tasks.shift();
            if (this.currentTask && this.currentTask.getStatus() === TaskStatus.Initialized) {
                this.currentTask.start();
            }
        }
       
        if(this.currentTask && this.currentTask.getStatus() === TaskStatus.Canceled) {
            this.currentTask.cancel();
        }
    }

    private createMovementAnimations() {
        this.createAnimation("right", this.getIdTag(), 143, 147, 15, true, true);
        this.createAnimation("down-right", this.getIdTag(), 143, 147, 15, true, true);
        this.createAnimation("up", this.getIdTag(), 104, 112, 15, true, true);
        this.createAnimation("down", this.getIdTag(), 130, 138, 15, true, true);
        this.createAnimation("left", this.getIdTag(), 117, 121, 15, true, true);
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
            case "down-right":
            case "right":
                return 143;
            case "down":
                return 130;
            case "left":
                return 117;
        }
        return -1;
    }

    // public getBody(): Physics.Arcade.Body {
    //     return this.body as Physics.Arcade.Body;
    // }
}
