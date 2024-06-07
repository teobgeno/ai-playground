import {LandState, LandElements} from "./types";
import { CropType } from "./types";
import { Crop } from "./Crop";

export class Land {
    private crop: Crop | null;
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private landState: LandState;
    private isConstructed: boolean = false;
    private posX: number;
    private posY: number;
    private elements: LandElements;

    //status plowed, planted

    constructor(scene: Phaser.Scene, x: number, y: number) {
        //https://github.com/Blockost/farming-rpg/blob/master/src/app/objects/crops/crop.ts
        //https://github.com/amcolash/farming-game/blob/master/src/farm/land.ts
        this.scene = scene;
        this.posX = x;
        this.posY = y;
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
        this.landState = LandState.PLOWED;
        this.elements = {
            water: 0,
            fertilizer: 0,
        };

        this.sprite.setAlpha(1);
      
    }

    public getPosX() {
        return this.posX;
    }

    public getPosY() {
        return this.posY;
    }

    public getState() {
        return this.landState;
    }

    public water() {
        this.sprite.setTint(Phaser.Display.Color.GetColor(190, 190, 190));
        this.elements.water = 100;
    }

    public plantCrop(cropType: CropType) {
        if(this.landState === LandState.PLOWED) {
            this.crop = new Crop(this.scene, cropType, this.posX, this.posY);
            this.crop.getSprite().on("pointerup",this.onHarvestCrop);
            this.landState = LandState.PLANTED;
        }
        
    }

    private onHarvestCrop = () =>{
        console.log('crop harvest')
        if(this.landState === LandState.READY) {
            this.landState = LandState.PLOWED;
            this.harvestCrop();
            this.crop?.getSprite().off("pointerup",this.onHarvestCrop);
            this.crop?.remove();
            this.crop = null;
            this.updateTile();
            
        }
    }

    public harvestCrop() {
        //TODO::add to player inventory
    }

     //TODO:: change cursor when crop ready
     //https://github.com/phaserjs/examples/blob/master/public/src/input/cursors/custom%20cursor.js
     //https://www.html5gamedevs.com/topic/38318-change-cursor-on-demand/
     //https://labs.phaser.io/edit.html?src=src/input/cursors/custom%20cursor.js
    public update(time: number) {
        if (LandState.PLANTED) {
            this.crop?.update(time, this.elements);
            if(this.crop?.isFullGrown() && this.landState === LandState.PLANTED) {
                this.landState = LandState.READY;
                this.crop?.setHarvestInteractive();
            }
        }
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
