import { Input, Scene } from 'phaser';

import { EVENTS_NAME, GameStatus } from './consts';
import { Actor } from './actor';
import { Text } from './text';

export class Player extends Actor {
  private keyW: Input.Keyboard.Key;
  private keyA: Input.Keyboard.Key;
  private keyS: Input.Keyboard.Key;
  private keyD: Input.Keyboard.Key;
  private keySpace: Input.Keyboard.Key;
  private hpValue: Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'hero');

    // KEYS
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');
    this.keySpace = this.scene.input.keyboard.addKey(32);
    this.keySpace.on('down', (event: KeyboardEvent) => {
      this.anims.play('attack', true);
      this.scene.game.events.emit(EVENTS_NAME.attack);
    });

    this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString()).setFontSize(12).setOrigin(0.8, 0.5);

    // PHYSICS
    this.getBody().setSize(32, 64);
    //this.getBody().setOffset(8, 0);

    // ANIMATIONS
    this.initAnimations();

    this.on('destroy', () => {
      this.keySpace.removeAllListeners();
    });
  }

  update(): void {
    this.getBody().setVelocity(0);

    if (this.keyW?.isDown) {
      this.body.velocity.y = -110;
      !this.anims.isPlaying && this.anims.play('hero_move_up', true);
    }

    if (this.keyA?.isDown) {
      this.body.velocity.x = -110;
    //   this.checkFlip();
    //   this.getBody().setOffset(48, 15);
      !this.anims.isPlaying && this.anims.play('hero_move_left', true);
    }

    if (this.keyS?.isDown) {
      this.body.velocity.y = 110;
      !this.anims.isPlaying && this.anims.play('hero_move_down', true);
    }

    if (this.keyD?.isDown) {
      this.body.velocity.x = 110;
    //   this.checkFlip();
    //   this.getBody().setOffset(15, 15);
      !this.anims.isPlaying && this.anims.play('hero_move_right', true);
    }

    this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
    this.hpValue.setOrigin(0.8, 0.5);
  }

  private initAnimations(): void {
    // this.scene.anims.create({
    //   key: 'run',
    //   frames: this.scene.anims.generateFrameNames('a-king', {
    //     prefix: 'run-',
    //     end: 7,
    //   }),
    //   frameRate: 8,
    // });

    // this.scene.anims.create({
    //   key: 'attack',
    //   frames: this.scene.anims.generateFrameNames('a-king', {
    //     prefix: 'attack-',
    //     end: 2,
    //   }),
    //   frameRate: 8,
    // });
    this.createHumanoidAnimations('hero');
  }

  public createHumanoidAnimations(key: string) {
    let texture = key;
    // TODO: don't hardcode, store in JSON of find a way to infer it
    // (standardize all spritesheets?)
    this.createAnimation(key + '_move_right', texture, 143, 147, 15, 10, true);
    this.createAnimation(key + '_move_up', texture, 104, 112, 15, 10, true);
    this.createAnimation(key + '_move_down', texture, 130, 138, 15, 10, true);
    this.createAnimation(key + '_move_left', texture, 117, 121, 15, 10, true);

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
    var config = {
      key: key,
      frames: this.scene.anims.generateFrameNumbers(texture, { start: start, end: end }),
      frameRate: rate,
    //   repeat: 0,
    };
    //if (loop) config.repeat = -1;
    //if (revert) config.frames.push({ key: texture, frame: start });
    this.scene.anims.create(config);
  }

  public getDamage(value?: number): void {
    super.getDamage(value);
    this.hpValue.setText(this.hp.toString());

    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE);
    }
  }
}
