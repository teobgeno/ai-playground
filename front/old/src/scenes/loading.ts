import { GameObjects, Scene, Tilemaps, } from 'phaser';
import { Player } from '../player';

//https://greenzeta.com/update/javascript-game-development-with-phaser-tile-maps-plug-ins/
//https://github.com/mwilber/the-legend-of-zeta/blob/master/src/GameScene.js
//https://phaser.io/examples/v3

export class LoadingScene extends Scene {

  //private hero!: GameObjects.Sprite;
  private player!: Player;
  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private groundLayer!: Tilemaps.TilemapLayer;
  private treesLayer!: Tilemaps.TilemapLayer;
  private collisionsLayer!: Tilemaps.TilemapLayer;
  private text!:Phaser.GameObjects. Text

  constructor() {
    super('loading-scene');
  }

  preload(): void {
    //this.load.baseURL = 'assets/';

    //https://www.html5gamedevs.com/topic/31300-how-to-get-tiled-json-map-into-phaser-json-tile-map-error-cannot-read-property-2-of-undefined/
     // MAP LOADING
     this.load.image({
      key: 'tiles',
      url: 'assets/tiles/farm.png',
    });
    this.load.tilemapTiledJSON('farm', 'assets/tilemaps/farm.json');

    //this.load.image('hero', 'assets/sprites/hero.png');
    this.load.spritesheet('hero', 'assets/sprites/hero.png', {
        frameWidth: 64,
        frameHeight: 64,
    });

    this.load.atlas(
      'items',
      'assets/sprites/items.png',
      'assets/sprites/items.json',
    );
    
  }

  create(): void {
    this.initMap();
  
    //this.add.sprite(100, 100, 'hero');

    let t = this.add.sprite(100, 50, 'items', 'basic_axe')
    t.setInteractive(new Phaser.Geom.Rectangle(0, 0, 32, 64), Phaser.Geom.Rectangle.Contains);
    t.on('pointerdown', function () {
     console.log('wood thitsa');
   
    })


    this.player = new Player(this, 200, 100);
    this.physics.add.collider(this.player, this.treesLayer);
    this.initCamera();


    this.text = this.add.text(10, 10, 'Move the mouse', { font: '16px Courier', color: '#00ff00' });





  }

  update(): void {
    this.player.update();

    // var pointer:any = this.input.activePointer;
    // this.text.setText([
    //     'x: ' + pointer.x,
    //     'y: ' + pointer.y,
    //     'mid x: ' + pointer.midPoint.x,
    //     'mid y: ' + pointer.midPoint.y,
    //     'velocity x: ' + pointer.velocity.x,
    //     'velocity y: ' + pointer.velocity.y,
    //     'movementX: ' + pointer.movementX,
    //     'movementY: ' + pointer.movementY
    // ]);
  }

  private initMap(): void {
    this.map = this.make.tilemap({ key: 'farm', tileWidth: 32, tileHeight: 32 });
    this.tileset = this.map.addTilesetImage('farm', 'tiles');
    this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);
    this.treesLayer = this.map.createLayer('Trees', this.tileset, 0, 0);

    this.treesLayer.setCollisionByProperty({ collides: true });

    // this.treesLayer.setInteractive(new Phaser.Geom.Rectangle(0, 0, 32, 64), Phaser.Geom.Rectangle.Contains);
    // this.treesLayer.on('pointerdown', function () {
    //  console.log('arxidia');
   
    // })



    //this.wallsLayer = this.map.createDynamicLayer('Walls', this.tileset, 0, 0);
    //this.wallsLayer.setCollisionByProperty({ collides: true });

    this.physics.world.setBounds(0, 0,this.map.widthInPixels, this.map.heightInPixels);
    //this.showDebugWalls();
  }

  private initCamera(): void {
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels,this.map.heightInPixels);
    //this.cameras.main.setSize(this.map.widthInPixels, this.map.heightInPixels);
    //this.cameras.main.setZoom(1);
  }
}
