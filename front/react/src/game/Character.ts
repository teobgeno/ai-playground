import Phaser, { Tilemaps } from "phaser";
import { Direction, GridEngine } from "grid-engine";
import { Input, Physics } from "phaser";
import CharacterController from "./CharacterController";
class Character extends Physics.Arcade.Sprite {
    private keyW: Input.Keyboard.Key;
    private keyA: Input.Keyboard.Key;
    private keyS: Input.Keyboard.Key;
    private keyD: Input.Keyboard.Key;
    private gridEngine: GridEngine;
    private id: string;
    private characterController: CharacterController;
    constructor(
        scene: Phaser.Scene,
        texture: string,
        gridEngine: GridEngine,
        //map: Tilemaps.Tilemap
        id: string
    ) {
        super(scene, 0, 0, texture);
        if (this.scene.input.keyboard) {
            this.keyW = this.scene.input.keyboard.addKey("W");
            this.keyA = this.scene.input.keyboard.addKey("A");
            this.keyS = this.scene.input.keyboard.addKey("S");
            this.keyD = this.scene.input.keyboard.addKey("D");
        }
        this.id = id;
        this.gridEngine = gridEngine;

        this.characterController = new CharacterController(
            this.scene,
            this,
            this.gridEngine,
            this.id
        );
    }

    public init() {
        this.createMovementAnimations();
        this.createHumanoidAnimations(this.id);
        this.getBody().setSize(32, 64);
        this.getBody().setCollideWorldBounds(true);
    }

    public getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

    update(dt: number): void {
        this.characterController.update(dt);
    }

    public createMovementAnimations() {
        this.createAnimation("right", this.id, 143, 147, 15, true, true);
        this.createAnimation("up", this.id, 104, 112, 15, true, true);
        this.createAnimation("down", this.id, 130, 138, 15, true, true);
        this.createAnimation("left", this.id, 117, 121, 15, 10, true, true);
    }

    public createHumanoidAnimations(key: string) {
        const texture = key;
        this.createAnimation(
            key + "_attack_right",
            texture,
            195,
            200,
            15,
            false,
            true
        );
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

    public createAnimation(
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

    public getStopFrame(direction: string) {
        switch (direction) {
            case "up":
                return -1;
            case "right":
                return -1;
            case "down":
                return -1;
            case "left":
                return -1;
        }
        return -1;
    }
}
export default Character;
