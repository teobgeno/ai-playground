import { TimeManager } from "./TimeManager";
export class DayNight extends Phaser.GameObjects.Rectangle {

    readonly night: Phaser.Display.Color = new Phaser.Display.Color(0, 80, 200);
    readonly morning: Phaser.Display.Color = new Phaser.Display.Color(150, 100, 100);
    readonly noon: Phaser.Display.Color = new Phaser.Display.Color(255, 255, 255);
    readonly sunset: Phaser.Display.Color = new Phaser.Display.Color(200, 80, 0);
  
    readonly cutoff1: number = 0.5;
    readonly cutoff2: number = 0.65;
    readonly cutoff3: number = 0.85;

    private timeManager:TimeManager

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, timeManager: TimeManager) {
      super(scene, x, y, width, height, 0xffffff, 1);
      this.timeManager = timeManager;
      scene.add.existing(this);
      this.setAlpha(1);
      this.setDepth(4);
      this.setBlendMode(Phaser.BlendModes.MULTIPLY);
      
    }
  
    update(x: number, y: number) {
      // const dateS = new Date(this.timeManager.getCurrentStartOfDay());
      const dateC = new Date(this.timeManager.getCurrentTimestamp());
      // console.log(dateS.getUTCFullYear() + ' - ' + dateS.getMonth() + ' - ' + dateS.getDate() + ' - ' + dateS.getUTCHours() + ' - ' + dateS.getMinutes())
      console.log(dateC.getUTCFullYear() + ' - ' + dateC.getMonth() + ' - ' + dateC.getDate() + ' - ' + dateC.getUTCHours())
      // const diffMins = Math.round((((this.timeManager.getCurrentTimestamp() - this.timeManager.getCurrentStartOfDay()) % 86400000) % 3600000) / 60000);
    //   const gameTime = moment(this.scene.game.registry.get('gameTime')).utc();
    //   const dayStart = gameTime.clone().startOf('day');

    let diffc =(this.timeManager.getCurrentTimestamp() - this.timeManager.getCurrentStartOfDay()) / 1000;
    diffc /= 60;
    diffc = Math. abs(Math. round(diffc))

      let diff = diffc / 1440;
      //console.log(diff)
    //   const beginning = diff;
  
      let start, end;
      if (diff < this.cutoff1) {
        console.log('morning')
        start = this.night;
        end = this.morning;
        diff = (diff / this.cutoff1);
      } else if (diff < this.cutoff2) {
        console.log('noon')
        start = this.morning;
        end = this.noon;
        diff = (diff - this.cutoff1) / (this.cutoff2 - this.cutoff1);
      } else if (diff < this.cutoff3) {
        console.log('afternoon')
        start = this.noon;
        end = this.sunset;
        diff = (diff - this.cutoff2) / (this.cutoff3 - this.cutoff2);
      } else {
        console.log('night')
        start = this.sunset;
        end = this.night;
        diff = (diff - this.cutoff3) / (1 - this.cutoff3);
      }
      // const start = this.sunset;
      // const end = this.night;
      // const diff = (18 - this.cutoff2) / (this.cutoff3 - this.cutoff2)
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(start, end, 1, diff);
      this.fillColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
      this.setPosition(x, y);
    }
  }