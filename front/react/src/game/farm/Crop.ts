import { SpriteItem } from "../items/SpriteItem";
import { ServiceLocator } from "../core/serviceLocator";
import { TimeManager } from "../TimeManager";
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
    public sprites: Array<SpriteItem> = [];
    private seed: Seed;
    private lastTimestamp: number = 0;
    private IntervalProcess: ReturnType<typeof setInterval>;
    private elements: LandElements = {
        water: 0,
        fertilizer: 0,
    };

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
                { texture: "crops", frame: this.seed.currentFrame },
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
        this.sprites[0].setDepth(dp);
        this.startGrowProcess();

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

    public setWaterAmount(waterAmount: number) {
        this.elements.water = waterAmount;
    }

    public getSeed() {
        return this.seed;
    }

    public isFullGrown() {
        return this.seed.getCurrentFrames().length - 1 === this.seed.currentFrame
            ? true
            : false;
    }

    public executeHarvest() {
        return this.seed.getCropFromHarvest();
    }

    public startGrowProcess() {
        //this.IntervalProcess = setInterval(() =>{this.updateGrow(tickPath.realSecs, tickPath.path)}, stepTime)
    }

    public updateGrow(time: number, elements: LandElements) {
        
        const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager')!;
        const currentTimestamp = timeManager.getCurrentTimestamp();

        if (this.lastTimestamp) {

            const currentDaysInterval = this.seed.getCurrentIntervals()[this.seed.currentInterval];
            const currentSecInterval = ((86400 * currentDaysInterval)/timeManager.scaleFactor)/100;
            
            
            if 
            (
                (currentTimestamp - this.lastTimestamp) >= currentSecInterval &&
                this.seed.currentFrame < this.seed.getCurrentFrames().length - 1 
            ) {
                
                const executionTimes = Math.floor((currentTimestamp - this.lastTimestamp)/currentSecInterval);
                this.lastTimestamp = currentTimestamp;
               
                for(let i = 0; i < executionTimes; i++) {
                    this.seed.currentGrowthStagePercentage += this.calculateGrowth(elements);
                    elements.water = this.consumeWater(elements.water);
                    //console.log('Current Growth: ' + this.seed.currentGrowthStagePercentage);
                    if(this.seed.currentGrowthStagePercentage >= 100) {
                        this.seed.currentGrowthStagePercentage = 0;

                        if(this.seed.currentFrame + 1 <= this.seed.getCurrentFrames().length - 1) {
                            this.seed.currentFrame = this.seed.currentFrame + 1;
                            this.updateTile();
                        }
                    }
                }
            }
        } else {
            this.lastTimestamp = currentTimestamp;
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
        const frame = this.seed.getCurrentFrames()[this.seed.currentFrame];
        this.sprites[0].getSprite().setFrame(frame);
    }

    public remove() {
        this.sprites[0].destroy();
        this.sprites = [];
    }

}
