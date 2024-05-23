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
    private crop: Crop | null;
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private landState: LandState;
    private bar: Phaser.GameObjects.Rectangle;

    private life: number;
    private health: number;

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
        this.crop = new Crop();
        //this.sprite = scene.add.sprite(x, y, "crops", 34);
        this.landState = LandState.PLANTED;
        this.sprite = scene.add.sprite(x+16, y+16, "crops", 19);
        this.sprite.setInteractive({ useHandCursor: true });
        this.sprite.setDepth(1);
        this.life = 90;
        this.health = 0.002;
        this.health = ((( this.health + 1) / 2) * 0.4) + 0.6;
        this.sprite.setTint(Phaser.Display.Color.GetColor( this.health * 255,  this.health * 255,  this.health * 255));
        //this.sprite.setTint(0xff0000)
        this.bar = scene.add.rectangle(x - 16, y - 16, 0, 2, 0x00ee00);
    }
    public update(time: number, delta: number) {

        if (this.crop != null) {
            this.life -= (delta / 1000) * (1 / (1 / 5));
            if (this.life < -this.crop.timeToDeath) {
              this.crop = null;
              this.landState = LandState.EMPTY;
              this.bar.alpha = 0;
              this.updateTile();
            } else {
              if (this.life > 0) {
                this.bar.fillColor = 0x00ee00;
                this.bar.width = (1 - (this.life / this.crop.timeToRipe)) * 32;
              } else {
                if (this.landState == LandState.PLANTED) {
                  this.landState = LandState.READY;
                  this.updateTile();
                }
                
                this.bar.fillColor = 0xee0000;
                this.bar.width = (1 - (-this.life / this.crop.timeToDeath)) * 32;
              }
            }
          } 
    }
    updateTile() {
        this.scene.events.emit('tileUpdate', this);
    
        let frame;
        switch(this.landState) {
          case LandState.PLOWED:
            frame = 18;
            break;
          case LandState.PLANTED:
            //frame = this.crop.frame + 6;
            frame = 6;
            break;
          case LandState.READY:
            //frame = this.crop.frame + 12;
            frame = 12;
            break;
          default:
            frame = 19;
            break;
        }
    
        this.sprite.setFrame(frame);
      }
}
