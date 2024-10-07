import { SpriteItem } from "../items/SpriteItem";
import { ServiceLocator } from "../core/serviceLocator";
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
    public sprites: Array<SpriteItem> = [];
    //private interactive: InteractiveItem;
    private seed: Seed;
    public initTimestamp: number = 0;
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

    // public getCurrentGrowthStage() {
    //     return this.seed.currentGrowthStageFrame;
    // }

    // public getCurrentGrowthStagePercentage() {
    //     return this.seed.currentGrowthStagePercentage;
    // }

    public getSeed() {
        return this.seed;
    }

    public isFullGrown() {
        return this.seed.currentGrowthStageFrame === this.seed.maxGrowthStageFrame
            ? true
            : false;
    }

    public executeHarvest() {
        return this.seed.getCropFromHarvest();
    }

    public updateGrowOld(time: number, elements: LandElements) {
        if(elements.water > 0) {
            if (this.lastTimestamp) {
                if (
                    ((Utils.getTimeStamp() - this.lastTimestamp)*1000) >= this.seed.growthStageInterval &&
                    this.seed.currentGrowthStageFrame < this.seed.maxGrowthStageFrame
                ) {
                    this.lastTimestamp = Utils.getTimeStamp();
                    let growthFrame = this.seed.startGrowthStageFrame + (Utils.getTimeStamp() - this.initTimestamp);
                    if(growthFrame > this.seed.maxGrowthStageFrame) {
                        growthFrame = this.seed.maxGrowthStageFrame
                    }
                    this.seed.currentGrowthStageFrame = growthFrame;
                    this.updateTile();
                }
            } else {
                this.lastTimestamp = Utils.getTimeStamp();
                this.initTimestamp =  this.lastTimestamp;
            }
        } else {
            this.lastTimestamp = Utils.getTimeStamp();
            this.initTimestamp =  this.lastTimestamp;
        }
        
    }

    public updateGrow(time: number, elements: LandElements) {
        if (this.lastTimestamp) {

            //this.seed.getCurrentIntervals();
            
            if (
                ((Utils.getTimeStamp() - this.lastTimestamp)*1000) >= this.seed.growthStageInterval &&
                this.seed.currentGrowthStageFrame < this.seed.maxGrowthStageFrame
            ) {
                
                const executionTimes = (Utils.getTimeStamp() - this.lastTimestamp);
                this.lastTimestamp = Utils.getTimeStamp();
               
                for(let i = 0; i < executionTimes; i++) {
                    this.seed.currentGrowthStagePercentage += this.calculateGrowth(elements);
                    elements.water = this.consumeWater(elements.water);
                    //console.log('Current Growth: ' + this.seed.currentGrowthStagePercentage);
                    if(this.seed.currentGrowthStagePercentage >= 100) {
                        this.seed.currentGrowthStagePercentage = 0;
                        if(this.seed.currentGrowthStageFrame + 1 <= this.seed.maxGrowthStageFrame) {
                            this.seed.currentGrowthStageFrame = this.seed.currentGrowthStageFrame + 1;
                            this.updateTile();
                        }
                    }
                }
            }
        } else {
            this.lastTimestamp = Utils.getTimeStamp();
            this.initTimestamp =  this.lastTimestamp;
        }

        return elements;
    }

    private calculateGrowth(elements: LandElements) {
        const waterFactor = this.getWaterConsumptionFactor(elements.water);
        //console.log('Water Factor: ' + waterFactor);
        return this.seed.baseGrowthRate*waterFactor
    }

    
    private getWaterConsumptionFactor(waterAvailable: number) {
        let waterFactor = 1;
        const currentWaterConsumption = this.getWaterConsumption();
        if(waterAvailable > 0 && currentWaterConsumption > waterAvailable) {
            waterFactor = waterAvailable/currentWaterConsumption;
        }

        if(waterAvailable === 0) {
            waterFactor = 0;
        }

        return waterFactor;
    }

    private getWaterConsumption() {
        // const weatherPatterns = {
        //     sunny: new Weather('Sunny', { growthMultiplier: 1.1, waterConsumption: 1.2 }),
        //     rainy: new Weather('Rainy', { growthMultiplier: 1.2, waterConsumption: 0.8 }),
        //     stormy: new Weather('Stormy', { growthMultiplier: 0.9, waterConsumption: 1.0 }),
        //     drought: new Weather('Drought', { growthMultiplier: 0.5, waterConsumption: 2.0 })
        // };
        return this.seed.baseWaterConsumption;
    }

    private consumeWater(waterAvailable: number) {
        const finalWater = waterAvailable - this.getWaterConsumption();
        return finalWater >= 0 ? finalWater : 0;
    }


    updateTile() {
        const frame = this.seed.currentGrowthStageFrame;
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
