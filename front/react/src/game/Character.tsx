import Phaser, { Tilemaps } from "phaser";
import { Direction, GridEngine } from "grid-engine";
import { Input, Physics } from "phaser";
class Character extends Physics.Arcade.Sprite { 
    private keyW: Input.Keyboard.Key;
    private keyA: Input.Keyboard.Key;
    private keyS: Input.Keyboard.Key;
    private keyD: Input.Keyboard.Key;
    private gridEngine:GridEngine;

    constructor(
        scene: Phaser.Scene,
        texture: string,
        gridEngine: GridEngine,
        //map: Tilemaps.Tilemap
    ) {
        super(scene, 0, 0, texture);
        
        this.keyW = this.scene.input.keyboard.addKey("W");
        this.keyA = this.scene.input.keyboard.addKey("A");
        this.keyS = this.scene.input.keyboard.addKey("S");
        this.keyD = this.scene.input.keyboard.addKey("D");

        this.createHumanoidAnimations('hero');
        
        this.gridEngine = gridEngine;

        // this.scene.input.on('pointerup', (pointer:any) => {
        //     // Get the WORLD x and y position of the pointer
        //     const {worldX, worldY} = pointer;
        //     console.log(pointer)
        //     // Assign the world x and y to our vector
        //     const target ={x:0,y:0};
        //     target.x = worldX;
        //     target.y = worldY;
      
        //     // // Position the arrow at our world x and y
        //     // this.arrow.body.reset(worldX, worldY);
        //     // this.arrow.setVisible(true);
      
        //     // // Start moving our cat towards the target
        //     //this.setPosition(128, 256);
        //     this.scene.physics.moveToObject(this, pointer, 200);
        //   });
    }

   
    public getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
      }

    updateOld(): void {
        //this.getBody().setSize(32, 64);
        if (this.keyW?.isDown) {
            //console.log('W')
            this.gridEngine.move("hero", Direction.UP);
        }
        if (this.keyA?.isDown) {
            //console.log('A')
            this.gridEngine.move("hero", Direction.LEFT);
        }

        if (this.keyS?.isDown) {
            //console.log('S')
            this.gridEngine.move("hero", Direction.DOWN);
        }
        if (this.keyD?.isDown) {
           // console.log('D')
            this.gridEngine.move("hero", Direction.RIGHT);
        }
        

        // this.getBody().setVelocity(0);

        // if (this.keyW?.isDown) {
        //     this.body.velocity.y = -110;
        //     !this.anims.isPlaying && this.anims.play("hero_move_up", true);
        // }

        // if (this.keyA?.isDown) {
        //     this.body.velocity.x = -110;
        //     //   this.checkFlip();
        //     //   this.getBody().setOffset(48, 15);
        //     !this.anims.isPlaying && this.anims.play("hero_move_left", true);
        // }

        // if (this.keyS?.isDown) {
        //     this.body.velocity.y = 110;
        //     !this.anims.isPlaying && this.anims.play("hero_move_down", true);
        // }

        // if (this.keyD?.isDown) {
        //     this.body.velocity.x = 110;
        //     !this.anims.isPlaying && this.anims.play("hero_move_right", true);
        // }
    }

    public createHumanoidAnimations(key: string) {
        const texture = key;
        // TODO: don't hardcode, store in JSON of find a way to infer it
        // (standardize all spritesheets?)
        this.createAnimation.call(this, 'right', texture, 143, 147, 15, 10, true);
        this.createAnimation.call(this,'up', texture, 104, 112, 15, 10, true);
        this.createAnimation.call(this,'down', texture, 130, 138, 15, 10, true);
        this.createAnimation.call(this,'left', texture, 117, 121, 15, 10, true);
    
        this.createAnimation(key + '_attack_right', texture, 195, 200, 15, false, true);
        this.createAnimation(key + '_attack_down', texture, 182, 187, 15, false, true);
        this.createAnimation(key + '_attack_left', texture, 169, 174, 15, false, true);
        this.createAnimation(key + '_attack_up', texture, 156, 161, 15, false, true);
    
        this.createAnimation(key + '_bow_right', texture, 247, 259, 15, false, true);
        this.createAnimation(key + '_bow_down', texture, 234, 246, 15, false, true);
        this.createAnimation(key + '_bow_left', texture, 221, 233, 15, false, true);
        this.createAnimation(key + '_bow_up', texture, 208, 220, 15, false, true);
    
        this.createAnimation(key + '_rest_down', texture, 130, 130, null, null, null);
        this.createAnimation(key + '_rest_left', texture, 117, 117, null, null, null);
        this.createAnimation(key + '_rest_right', texture, 143, 143, null, null, null);
        this.createAnimation(key + '_rest_up', texture, 104, 104, null, null, null);
      }
    
      public createAnimation(key: any, texture: any, start: any, end: any, rate: any, loop: any, revert: any) {
        rate = rate || 10;
        const config = {
          key: key,
          frames: this.scene.anims.generateFrameNumbers(texture, { start: start, end: end }),
          frameRate: rate,
        //   repeat: 0,
        };
        //if (loop) config.repeat = -1;
        //if (revert) config.frames.push({ key: texture, frame: start });
        this.scene.anims.create(config);
      }


      update(): void {
        this.getBody().setVelocity(0);
      
        if (this.keyW?.isDown) {
          this.body.velocity.y = -110;
          !this.anims.isPlaying && this.anims.play('up', true);
        }
    
        if (this.keyA?.isDown) {
          this.body.velocity.x = -110;
        //   this.checkFlip();
        //   this.getBody().setOffset(48, 15);
          !this.anims.isPlaying && this.anims.play('left', true);
        }
    
        if (this.keyS?.isDown) {
          this.body.velocity.y = 110;
          !this.anims.isPlaying && this.anims.play('down', true);
        }
    
        if (this.keyD?.isDown) {
          this.body.velocity.x = 110;
        //   this.checkFlip();
        //   this.getBody().setOffset(15, 15);
          !this.anims.isPlaying && this.anims.play('right', true);
        }
    
      }


      public checkFlip(): void {
        if (this.body.velocity.x < 0) {
          this.scaleX = -1;
        } else {
          this.scaleX = 1;
        }
      }

}
export default Character;
