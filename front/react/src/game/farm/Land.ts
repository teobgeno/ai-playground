import { Game } from "../scenes/Game";
import { Seed } from "./Seed";
import { Crop } from "./Crop";
import { LandState, LandElements } from "./types";

export class Land {
    private crop: Crop | null;
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private landState: number;
    private x: number;
    private y: number;
    private pixelX: number;
    private pixelY: number;
    private elements: LandElements;

    //status plowed, planted

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        pixelX: number,
        pixelY: number
    ) {
        //https://github.com/Blockost/farming-rpg/blob/master/src/app/objects/crops/crop.ts
        //https://github.com/amcolash/farming-game/blob/master/src/farm/land.ts
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.pixelX = pixelX;
        this.pixelY = pixelY;
        // this.sprite = scene.add.sprite(
        //     this.pixelX + 16,
        //     this.pixelY + 16,
        //     "land",
        //     19
        // );
        this.sprite = scene.add.sprite(
            this.pixelX,
            this.pixelY,
            "fence",
            'sprite8'
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
        this.landState = LandState.PLOWED;
        this.elements = {
            water: 0,
            fertilizer: 0,
        };

        this.sprite.setAlpha(1);
    }

    public rollbackLand() {
        this.sprite.destroy();
    }

    public rollbackCrop() {
        this.destroyCrop();
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getPixelX() {
        return this.pixelX;
    }

    public getPixelY() {
        return this.pixelY;
    }

    public getState() {
        return this.landState;
    }

    public water() {
        this.sprite.setTint(Phaser.Display.Color.GetColor(190, 190, 190));
        this.elements.water = 100;
    }

    public createCrop(seed: Seed) {
        if (this.landState === LandState.PLOWED) {
            this.crop = new Crop(this.scene, seed, this.pixelX, this.pixelY);
        }
    }

    public plantCrop() {
        if (this.crop && this.landState === LandState.PLOWED) {
            this.crop.init();
            this.landState = LandState.PLANTED;
        }
    }

    private initInteractive = () => {
        this.crop?.initHarvestInteractive();
        this.crop?.getSprite().on("pointerup", this.onHarvestCrop);
    };

    private removeInteractive = () => {
        this.crop?.removeHarvestInteractive();
        this.crop?.getSprite().off("pointerup", this.onHarvestCrop);
    };

    public toggleInteraction(doInteract: boolean) {
        doInteract
            ? this.crop?.resumeHarvestInteractive()
            : this.crop?.pauseHarvestInteractive();
    }

    private onHarvestCrop = () => {
        (this.scene as Game).addPlayerTask('harvest', this);
    };

    public executeHarvestCrop() {
        return this.crop?.executeHarvest();
    }

    public endCrop() {
        //TODO::add to player inventory
        this.landState = LandState.PLOWED;
        this.destroyCrop();
    }

    public destroyCrop() {
        this.removeInteractive();
        this.crop?.remove();
        this.crop = null;
        this.updateTile();
    }

    //TODO:: change cursor when crop ready
    //https://github.com/phaserjs/examples/blob/master/public/src/input/cursors/custom%20cursor.js
    //https://www.html5gamedevs.com/topic/38318-change-cursor-on-demand/
    //https://labs.phaser.io/edit.html?src=src/input/cursors/custom%20cursor.js
    public update(time: number) {
        if (this.landState === LandState.PLANTED) {
            this.crop?.update(time, this.elements);
            if (this.crop?.isFullGrown()) {
                this.landState = LandState.READY;
                this.initInteractive();
                console.log(this.crop);
            }
        }
    }
    updateTile() {
        //this.scene.events.emit('tileUpdate', this);

        let frame = 0;
        switch (this.landState) {
            case LandState.PLOWED:
                frame = 19;
                break;
            case LandState.PLANTED:
                frame = 19;
                break;
            case LandState.READY:
                //frame = this.crop.frame + 12;
                //frame = 12;
                break;
            default:
                frame = 18;
                break;
        }

        this.sprite.setFrame(frame);
    }
}
