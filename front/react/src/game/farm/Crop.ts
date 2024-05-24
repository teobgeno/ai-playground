export class Crop  {
    public timeToRipe:number;
    public timeToDeath:number;
    public growthStageDuration:number;
    public lastTimestamp:number = 0;
    public maxGrowthStage:number;
    public currentGrowthStage:number;
   
    constructor() {
        this.timeToRipe = 10;
        this.timeToDeath = 30;
        this.growthStageDuration = 5000;
        this.maxGrowthStage = 34;
        this.currentGrowthStage = 30;
        this.lastTimestamp = 0;
    }

    public getCurrentGrowthStage() {
        return this.currentGrowthStage
    }
}