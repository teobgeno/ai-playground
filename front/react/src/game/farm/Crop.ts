import { SpriteItem } from "../items/SpriteItem";
import { InteractiveItem } from "../items/InteractiveItem";
import { Seed } from "./Seed";
import { Utils } from "../core/Utils";
import { LandElements } from "./types";
import {
    CoordsData,
    MapObject,
    ObjectId,
} from "../core/types";

export class Crop implements MapObject{
    public id: number;
    public objectId: ObjectId = ObjectId.FarmLand;
    //private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    public sprites: Array<SpriteItem> = [];
    //private interactive: InteractiveItem;
    private seed: Seed;
    public lastTimestamp: number = 0;
    //https://docs.google.com/spreadsheets/d/1DPAq3AyaXIlqML1KummuMHDS_MV3uH0Z7kXAZXKFsSQ/edit?pli=1&gid=0#gid=0  List crops
    constructor(scene: Phaser.Scene, seed: Seed, coords: CoordsData) {
        this.id = Utils.generateId();
        //this.scene = scene;
        this.seed = seed;
        //this.interactive = interactive;
        this.lastTimestamp = 0;

        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "crops", frame: this.seed.currentGrowthStageFrame },
                {
                    x: coords.x,
                    y: coords.y,
                    pixelX: coords.pixelX,
                    pixelY: coords.pixelY,
                },
                16,
                0
            )
        );
        // this.sprite = this.scene.add.sprite(
        //     x + 16,
        //     y,
        //     "crops",
        //     this.seed.currentGrowthStageFrame
        // );
        this.sprites[0].setDepth(2);
        this.sprites[0].setAlpha(0.8);
        
        
    }
    public init() {
        this.sprites[0].setAlpha(1);
        const dp = 2 + Utils.shiftPad(this.sprites[0].getSprite().y + this.sprites[0].getSprite().displayHeight/2, 7);
        this.sprites[0].setDepth(dp)

        //wiggle anim test
        // this.scene.tweens.add({
        //     targets: [ this.sprite ],
        //     x: this.sprite.x+1,
        //     y: this.sprite.y-1,
        //     yoyo: true,
        //     duration: 400,
        //     ease: 'Easing.Bounce.InOut',
        //     repeat: -1,
        // });

    }

    // public getSprite() {
    //     return this.sprite;
    // }

    public getCurrentGrowthStage() {
        return this.seed.currentGrowthStageFrame;
    }

    public isFullGrown() {
        return this.seed.currentGrowthStageFrame === this.seed.maxGrowthStageFrame
            ? true
            : false;
    }

    public executeHarvest() {
        return this.seed.getCropFromHarvest();
    }

    public updateGrow(time: number, elements: LandElements) {
        if (this.lastTimestamp) {
            //TODO:: use clock to calculate growth. Time is not always available. Scene chage, tab browser not active....
            if (
                time - this.lastTimestamp >= this.seed.growthStageDuration &&
                this.seed.currentGrowthStageFrame < this.seed.maxGrowthStageFrame
            ) {
                // console.log((time*1000) + ' - '+ this.lastTimestamp)
                //console.log(Math.floor(time/this.lastTimestamp)) update currentGrowthStage based on this
                this.lastTimestamp = time;
                this.seed.currentGrowthStageFrame++;
                this.updateTile();
            }
        } else {
            this.lastTimestamp = time;
        }
    }
    updateTile() {
        const frame = this.getCurrentGrowthStage();
        this.sprites[0].getSprite().setFrame(frame);
    }

    // public initHarvestInteractive() {
    //     this.sprite.setInteractive({
    //         cursor: "url(assets/cursors/axe.cur), pointer",
    //     });
    // }

    // public removeHarvestInteractive() {
    //     this.sprite.removeInteractive();
    // }

    // public pauseHarvestInteractive() {
    //     if (this.sprite.input && this.sprite.input.enabled) {
    //         this.sprite.disableInteractive();
    //     }
    // }

    // public resumeHarvestInteractive() {
    //     if (this.sprite.input && !this.sprite.input.enabled) {
    //         this.sprite.setInteractive();
    //     }
    // }

    public remove() {
        this.sprites[0].destroy();
        this.sprites = [];
    }

    // public getInteractive() {
    //     return this.interactive;
    // }
    
}
