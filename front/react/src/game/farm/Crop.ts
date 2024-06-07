import { CropType, LandElements } from "./types";
export class Crop {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    public timeToRipe: number;
    public timeToDeath: number;
    public growthStageDuration: number;
    public lastTimestamp: number = 0;
    public maxGrowthStage: number;
    public currentGrowthStage: number;

    constructor(scene: Phaser.Scene, cropType: CropType, x: number, y: number) {
        this.scene = scene;
        this.timeToRipe = 10;
        this.timeToDeath = 30;
        this.growthStageDuration = 1000;
        this.maxGrowthStage = 34;
        this.currentGrowthStage = 30;
        this.lastTimestamp = 0;

        this.sprite = this.scene.add.sprite(x + 16, y, "crops", 30);
        this.sprite.setInteractive({ useHandCursor: true });
        this.sprite.setDepth(2);
    }

    public getCurrentGrowthStage() {
        return this.currentGrowthStage;
    }

    public isFullGrown() {
        return this.currentGrowthStage === this.maxGrowthStage ? true : false;
    }

    public update(time: number, elements: LandElements) {
        if (this.lastTimestamp) {
            if (
                time - this.lastTimestamp >= this.growthStageDuration &&
                this.currentGrowthStage < this.maxGrowthStage
            ) {
                // console.log((time*1000) + ' - '+ this.lastTimestamp)
                //console.log(Math.floor(time/this.lastTimestamp)) update currentGrowthStage based on this
                this.lastTimestamp = time;
                this.currentGrowthStage++;
                this.updateTile();
            }
        } else {
            this.lastTimestamp = time;
        }
    }
    updateTile() {
        const frame = this.getCurrentGrowthStage();
        this.sprite.setFrame(frame);
    }

    public setHarvestInteractive(){
        this.sprite.setInteractive({ cursor: "url(assets/cursors/axe.cur), pointer" });
    }

    public remove(){
        this.sprite.destroy();
    }
}
