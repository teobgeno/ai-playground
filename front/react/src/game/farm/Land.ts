import { Physics } from "phaser";
import { Crop } from "./Crop";
//extends Physics.Arcade.Sprite

export enum LandState {
    EMPTY,
    PLOWED,
    PLANTED,
    READY
  }

export class Land {
    private crop: Crop;
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;

    //status plowed, planted

    constructor(scene: Phaser.Scene, x: number, y: number) {
        //super(scene, 0, 0, 'land');
        // if (this.scene.input.keyboard) {
        //     this.keyW = this.scene.input.keyboard.addKey("W");
        //     this.keyA = this.scene.input.keyboard.addKey("A");
        //     this.keyS = this.scene.input.keyboard.addKey("S");
        //     this.keyD = this.scene.input.keyboard.addKey("D");
        // }
        //https://github.com/Blockost/farming-rpg/blob/master/src/app/objects/crops/crop.ts
        //https://github.com/amcolash/farming-game/blob/master/src/farm/land.ts
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, "crops", 34);
        this.sprite.setInteractive({ useHandCursor: true });
        this.sprite.setDepth(1);
        let health = 0.002;
        health = (((health + 1) / 2) * 0.4) + 0.6;
        this.sprite.setTint(Phaser.Display.Color.GetColor(health * 255, health * 255, health * 255));
        //this.sprite.setTint(0xff0000)
        this.scene.add.rectangle(x , y - 38, 50, 2, 0x00ee00).setDepth(1);
    }
}
