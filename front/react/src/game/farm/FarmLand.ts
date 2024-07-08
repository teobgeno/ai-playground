import { Game } from "../scenes/Game";
import { SpriteItem } from "../items/SpriteItem";
import { InteractiveItem } from "../items/InteractiveItem";
import { Seed } from "./Seed";
import { Crop } from "./Crop";
import { LandState, LandElements } from "./types";
import { Storable } from "../items/types";

import { CoordsData, MapObject, MapObjectInteractable, ObjectId } from "../core/types";
import { Utils } from "../core/Utils";
export class FarmLand implements MapObject, MapObjectInteractable {
    public id: number;
    public objectId: ObjectId = ObjectId.FarmLand;
    private crop: Crop | null;
    private scene: Phaser.Scene;
    public sprites: Array<SpriteItem> = [];
    private interactive: InteractiveItem;
    private landState: number;
    private elements: LandElements;

    //status plowed, planted

    constructor(scene: Phaser.Scene, coords: CoordsData) {
        //https://github.com/Blockost/farming-rpg/blob/master/src/app/objects/crops/crop.ts
        //https://github.com/amcolash/farming-game/blob/master/src/farm/land.ts
        this.scene = scene;
        this.id = Utils.generateId();
        this.sprites.push(new SpriteItem(
            scene,
            { texture: "land", frame: 19 },
            {
                x: coords.x,
                y: coords.y,
                pixelX: coords.pixelX,
                pixelY: coords.pixelY,
            },
            16,
            16
        ));
        this.sprites[0].setDepth(1);
        this.sprites[0].setAlpha(0.4);

        this.interactive = new InteractiveItem();
        this.interactive.setSprites(this.sprites);
        this.interactive.setInteractiveObjectIds([ObjectId.WaterCan]);
        this.interactive.setInteractionResult((selectedObject: Storable)=>{
            console.log('water')
            console.log(selectedObject)
        });
        this.interactive.startInteraction();
        // this.sprite = scene.add.sprite(
        //     this.pixelX,
        //     this.pixelY,
        //     "fence",
        //     'sprite8'
        // );

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

        this.sprites[0].setAlpha(1);
    }

    public rollbackLand() {
        this.sprites[0].destroy();
    }

    public rollbackCrop() {
        this.destroyCrop();
    }

    public getState() {
        return this.landState;
    }

    public water() {
        //this.sprite.setTint(Phaser.Display.Color.GetColor(190, 190, 190));
        this.elements.water = 100;
    }

    public createCrop(seed: Seed) {
        if (this.landState === LandState.PLOWED) {
            this.crop = new Crop(
                this.scene,
                seed,
                this.sprites[0].getPixelX(),
                this.sprites[0].getPixelY()
            );
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
        (this.scene as Game).addPlayerTask("harvest", this);
    };

    public executeHarvestCrop() {
        return this.crop?.executeHarvest();
    }

    public endCrop() {
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
        let frame = 0;
        switch (this.landState) {
            case LandState.PLOWED:
                frame = 19;
                break;
            case LandState.PLANTED:
                frame = 19;
                break;
            case LandState.READY:
                break;
            default:
                frame = 18;
                break;
        }

        this.sprites[0].setFrame(frame);
    }

    public getSprite() {
        return this.sprites[0];
    }

    public getInteractive() {
        return this.interactive;
    }

}
