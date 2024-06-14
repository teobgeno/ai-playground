import { LandElements } from "./types";
import { Seed } from "./Seed";
export class Crop {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private seed: Seed;
    public lastTimestamp: number = 0;

    constructor(scene: Phaser.Scene, seed: Seed, x: number, y: number) {
        this.scene = scene;
        this.seed = seed;
        this.lastTimestamp = 0;
        this.sprite = this.scene.add.sprite(x + 16, y, "crops", this.seed.currentGrowthStage);
        this.sprite.setDepth(2);
        this.sprite.setAlpha(0.8);
       
    }
    public init() {
        this.sprite.setAlpha(1);
    }

    public getSprite() {
        return this.sprite;
    }

    public getCurrentGrowthStage() {
        return this.seed.currentGrowthStage;
    }

    public isFullGrown() {
        return this.seed.currentGrowthStage === this.seed.maxGrowthStage ? true : false;
    }

    public update(time: number, elements: LandElements) {
        if (this.lastTimestamp) {
            //TODO:: use clock to calculate growth. Time is not always available. Scene chage, tab browser not active....
            if (
                time - this.lastTimestamp >= this.seed.growthStageDuration &&
                this.seed.currentGrowthStage < this.seed.maxGrowthStage
            ) {
                // console.log((time*1000) + ' - '+ this.lastTimestamp)
                //console.log(Math.floor(time/this.lastTimestamp)) update currentGrowthStage based on this
                this.lastTimestamp = time;
                this.seed.currentGrowthStage++;
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
