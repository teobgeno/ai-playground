export class TimeManager {
    private gameStartTime: number; 
    private scaleFactor: number;
    private startTimeDifference: number;
    constructor() {
        this.gameStartTime = Date.now();
        this.scaleFactor = 20;
        const desiredStartTime = new Date('2024-07-31T10:00:00');
       
        this.startTimeDifference = desiredStartTime.getTime();
        console.log(this.startTimeDifference)
    }
    public update() {
      
        const currentTime = Date.now();
        const elapsedTimeRealTime = currentTime - this.gameStartTime;
        const elapsedTimeGameTime = (elapsedTimeRealTime + this.startTimeDifference) * this.scaleFactor;
      
        const hours = Math.floor(elapsedTimeGameTime / 3600000) % 24;
        const minutes = Math.floor((elapsedTimeGameTime % 3600000) / 60000) % 60;
        const seconds = Math.floor((elapsedTimeGameTime % 60000) / 1000) % 60;
      
        // Display in HH:MM:SS format
        //console.log(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }
}