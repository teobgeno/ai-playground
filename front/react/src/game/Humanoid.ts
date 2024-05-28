import Phaser, { Physics }  from "phaser";

export default class Humanoid extends Physics.Arcade.Sprite {
    private id: string;
    private stamina: number;
    constructor(
        scene: Phaser.Scene,
        texture: string,
        id: string,
    ) {
        super(scene, 0, 0, texture);
        this.scene = scene;
        this.id = id;
    }
    protected createAnimation(
        key: string,
        texture: string,
        start: number,
        end: number,
        rate: number | null,
        repeat: boolean | null,
        revert: any
    ) {
        rate = rate || 10;
        const config = {
            key: key,
            frames: this.scene.anims.generateFrameNumbers(texture, {
                start: start,
                end: end,
            }),
            frameRate: rate,
            repeat: 0,
        };
        if (repeat) config.repeat = -1;
        //if (revert) config.frames.push({ key: texture, frame: start });
        this.scene.anims.create(config);
    }

    public getStamina(){

    }

    public setStamina(){
        
    }
}