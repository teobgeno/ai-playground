import { Utils } from "./core/Utils";
export class TimeManager {
    private gameStartTime: number; 
    private scaleFactor: number;
    private initDate: number;
    private gameCurrentTimestamp: number
    private elapsedTime: number=0;
    private lastTimestamp: number =  Date.now();

    constructor() {
        this.gameStartTime = Date.now();
        this.scaleFactor = 96;
        this.initDate = Date.UTC(2024, 9, 3, 10, 30, 0);
    }

    public update(currentTime: number) {
        if(currentTime > this.lastTimestamp) {
            //console.log(currentTime - this.lastTimestamp)
            this.elapsedTime += currentTime - this.lastTimestamp;
            this.gameCurrentTimestamp = this.initDate + (this.elapsedTime * this.scaleFactor);
        }

        this.lastTimestamp = currentTime;
    }
    
    // public updateOld() {
    
    //     const currentTime = Date.now();
    //     const elapsedTimeRealTime = currentTime - this.gameStartTime;
    //     this.gameCurrentTimestamp = this.initDate + (elapsedTimeRealTime * this.scaleFactor);
      
    //     // const hour = Math.floor(this.gameCurrentTimestamp / 3600000) % 24;
    //     // const minute = Math.floor((this.gameCurrentTimestamp % 3600000) / 60000) % 60;
    //     // const second = Math.floor((this.gameCurrentTimestamp % 60000) / 1000) % 60;
        
    //     // console.log(new Date(elapsedTimeGameTime).getUTCDate())
    //     // console.log(new Date(elapsedTimeGameTime).getUTCMonth())
    //     // get hours new Date(elapsedTimeGameTime).getUTCHours()
    //     // Display in HH:MM:SS format
    //     //console.log(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`);
    // }

    public setTimeScale(factor: number) {
        this.scaleFactor = factor;
    }

    public getCurrentTimestamp() {
        return this.gameCurrentTimestamp;
    }

    public getCurrentStartOfDay() {
        const currentDate = new Date(this.gameCurrentTimestamp);
        return Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0)
    }

    public getCurrentDateTimeToString() {
        const currentDate = new Date(this.gameCurrentTimestamp);
        return `${currentDate.getUTCFullYear()}-${Utils.shiftPad(currentDate.getUTCMonth(), 2)}-${Utils.shiftPad(currentDate.getUTCDate(), 2)} ${Utils.shiftPad(currentDate.getUTCHours(), 2)}:${Utils.shiftPad(currentDate.getUTCMinutes(), 2)}:${Utils.shiftPad(currentDate.getUTCSeconds(), 2)}`
    }
}