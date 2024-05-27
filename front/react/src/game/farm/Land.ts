import { CropType } from "./types";
import { Physics } from "phaser";
import { Crop } from "./Crop";
//extends Physics.Arcade.Sprite

export enum LandState {
    EMPTY,
    PLOWED,
    PLANTED,
    READY,
}

export class Land {
    private crop: Crop | null;
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private landState: LandState;
    private bar: Phaser.GameObjects.Rectangle;
    private life: number;
    private health: number;
    private isConstructed: boolean = false;
    private posX: number;
    private posY: number;

    //status plowed, planted

    constructor(scene: Phaser.Scene, x: number, y: number) {
        //https://github.com/Blockost/farming-rpg/blob/master/src/app/objects/crops/crop.ts
        //https://github.com/amcolash/farming-game/blob/master/src/farm/land.ts
        this.scene = scene;
        this.posX = x;
        this.posY = y;
        this.landState = LandState.PLOWED;
        this.sprite = scene.add.sprite(
            this.posX + 16,
            this.posY + 16,
            "land",
            19
        );
        this.sprite.setDepth(1);
        this.sprite.setAlpha(0.4);

        // const r = Math.floor(Math.random() * 10)
        // if(r > 5) {
        //   t.setTint(Phaser.Display.Color.GetColor(190, 190, 190));
        // }

        //this.sprite.setAlpha(0.4);

        // this.sprite = scene.add.sprite(x+16, y, "crops", 30);
        // this.sprite.setInteractive({ useHandCursor: true });
        // this.sprite.setDepth(2);

        // this.life = 90;
        // this.health = 0.002;
        // this.health = ((( this.health + 1) / 2) * 0.4) + 0.6;

        //this.sprite.setTint(Phaser.Display.Color.GetColor( this.health * 255,  this.health * 255,  this.health * 255));
        //this.sprite.setTint(0xff0000)
        //this.bar = scene.add.rectangle(x - 16, y - 16, 0, 2, 0x00ee00);
    }

    public init() {
        this.isConstructed = true;
        this.sprite.setAlpha(1);
    }

    public getPosX() {
      return this.posX;
    }

    public getPosY() {
      return this.posY;
    }

    public water() {
        this.sprite.setTint(Phaser.Display.Color.GetColor(190, 190, 190));
    }

    public plantCrop(cropType: CropType) {
        this.crop = new Crop(this.scene, cropType, this.posX, this.posY);
        this.landState = LandState.PLANTED;
        //this.updateTile();
    }

    public update(time: number, delta: number) {
        //console.log(this.crop.lastTimestamp)

        if (LandState.PLANTED) {
            this.crop?.update(time);
        }

        // if (this.isConstructed && this.crop) {
        //     if (this.crop.lastTimestamp) {
        //         if (
        //             this.crop.currentGrowthStage === this.crop.maxGrowthStage &&
        //             this.landState != LandState.READY
        //         ) {
        //             this.landState = LandState.READY;
        //         }

        //         if (
        //             time - this.crop.lastTimestamp >=
        //                 this.crop.growthStageDuration &&
        //             this.crop.currentGrowthStage < this.crop.maxGrowthStage
        //         ) {
        //             // console.log((time*1000) + ' - '+ this.crop.lastTimestamp)
        //             //console.log(Math.floor(time/this.crop.lastTimestamp)) update currentGrowthStage based on this
        //             this.crop.lastTimestamp = time;
        //             this.crop.currentGrowthStage++;
        //             this.updateTile();
        //         }
        //     } else {
        //         this.crop.lastTimestamp = time;
        //     }

        //     //console.log(time)
        // }


        //console.log(time)
        // if (this.crop != null) {
        //     this.life -= (delta / 1000) * (1 / (1 / 5));
        //     if (this.life < -this.crop.timeToDeath) {
        //       this.crop = null;
        //       this.landState = LandState.EMPTY;
        //       this.bar.alpha = 0;
        //       this.updateTile();
        //     } else {
        //       if (this.life > 0) {
        //         this.bar.fillColor = 0x00ee00;
        //         this.bar.width = (1 - (this.life / this.crop.timeToRipe)) * 32;
        //       } else {
        //         if (this.landState == LandState.PLANTED) {
        //           this.landState = LandState.READY;
        //           this.updateTile();
        //         }

        //         this.bar.fillColor = 0xee0000;
        //         this.bar.width = (1 - (-this.life / this.crop.timeToDeath)) * 32;
        //       }
        //     }
        //   }
    }
    updateTile() {
        //this.scene.events.emit('tileUpdate', this);

        let frame = 0;
        switch (this.landState) {
            case LandState.PLOWED:
                frame = 18;
                break;
            case LandState.PLANTED:
                frame = 19;
                break;
            case LandState.READY:
                //frame = this.crop.frame + 12;
                //frame = 12;
                break;
            default:
                frame = 19;
                break;
        }

        this.sprite.setFrame(frame);
    }
}
