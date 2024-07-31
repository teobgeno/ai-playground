export class TimeManager {
    private gameStartTime: number; 
    private scaleFactor: number;
    private initDate: number;
    private gameCurrentTimestamp: number

    constructor() {
        this.gameStartTime = Date.now();
        this.scaleFactor = 1000;
        const initDate = new Date(Date.UTC(2024, 6, 31, 10, 30, 0));
        this.initDate = initDate.getTime();

    }
    public update() {
    
        const currentTime = Date.now();
        const elapsedTimeRealTime = currentTime - this.gameStartTime;
        this.gameCurrentTimestamp = this.initDate + (elapsedTimeRealTime * this.scaleFactor);
      
        // const hour = Math.floor(this.gameCurrentTimestamp / 3600000) % 24;
        // const minute = Math.floor((this.gameCurrentTimestamp % 3600000) / 60000) % 60;
        // const second = Math.floor((this.gameCurrentTimestamp % 60000) / 1000) % 60;
        
        // console.log(new Date(elapsedTimeGameTime).getUTCDate())
        // console.log(new Date(elapsedTimeGameTime).getUTCMonth())
        // get hours new Date(elapsedTimeGameTime).getUTCHours()
        // Display in HH:MM:SS format
        //console.log(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`);
    }

    public getCurrentTimestamp() {
        return this.gameCurrentTimestamp;
    }

    public getCurrentStartOfDay() {
        const currentDate = new Date(this.gameCurrentTimestamp);
        const t = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0))
        console.log(t.getTime())
        return new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0))
    }
}