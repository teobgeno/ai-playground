import { EventBus } from "../EventBus";
import { Scene, Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import Character from "../character";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    gameText: Phaser.GameObjects.Text;
    gridEngine: GridEngine;
    hero: Character;
    // private map!: Tilemaps.Tilemap;
    private tileset!: Tilemaps.Tileset;
    // private treesLayer!: Tilemaps.TilemapLayer;

    constructor() {
        super("Game");
    }

    preload() {
        //this.load.baseURL = 'assets/';

        //https://www.html5gamedevs.com/topic/31300-how-to-get-tiled-json-map-into-phaser-json-tile-map-error-cannot-read-property-2-of-undefined/
        // MAP LOADING
        this.load.image({
            key: "tiles",
            url: "assets/tiles/farm.png",
        });
        this.load.tilemapTiledJSON("farm", "assets/tilemaps/farm.json");

        //this.load.image('hero', 'assets/sprites/hero.png');
        this.load.spritesheet("hero", "assets/sprites/hero.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.atlas(
            "items",
            "assets/sprites/items.png",
            "assets/sprites/items.json"
        );
    }

    create() {
        const map = this.initMap();
       

        this.hero = this.add.existing(new Character(this, 'hero', this.gridEngine, map));
        //const playerSprite = this.add.sprite(0, 0, "player");

        const gridEngineConfig = {
            characters: [
                {
                    id: "hero",
                    sprite: this.hero,
                    walkingAnimationMapping: 6,
                    startPosition: { x: 15, y: 10 },
                },
            ],
        };

        this.gridEngine.create(map, gridEngineConfig);

        this.initCamera(map);
        
        this.add.text(10, 10, "Move the mouse", {
            font: "16px Courier",
            color: "#00ff00",
        });

        // const gridEngineConfig: gridEngineType = {
        //     characters: [
        //       {

        //       },
        //       {

        //       },
        //     ],
        //     numberOfDirections: 4
        //   };

        // this.gridEngine.create(map, gridEngineConfig);

        // this.camera = this.cameras.main;
        // this.camera.setBackgroundColor(0x00ff00);

        // this.background = this.add.image(512, 384, 'background');
        // this.background.setAlpha(0.5);

        // this.gameText = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5).setDepth(100);

        EventBus.emit("current-scene-ready", this);
    }

    private initMap() {
        const map = this.make.tilemap({
            key: "farm",
            tileWidth: 32,
            tileHeight: 32,
        });
        const tilesets = map.addTilesetImage("farm", "tiles");
        if(tilesets) {
            for (let i = 0; i < map.layers.length; i++) {
                map.createLayer(i, tilesets, 0, 0);
              }
        }
        


        // map.createLayer("Ground", this.tileset, 0, 0);
        // map.createLayer("Trees", this.tileset, 0, 0);
        //treesLayer.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );

        return map;
        //this.gridEngine.create(map, {});
        //this.showDebugWalls();
    }

    private initCamera(map: Tilemaps.Tilemap): void {
        this.cameras.main.startFollow(this.hero, true, 0.09, 0.09);
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        //this.cameras.main.setSize(1024, 768);
        //this.cameras.main.setSize(this.map.widthInPixels, this.map.heightInPixels);
        //this.cameras.main.setZoom(1);
    }

    update(): void {}

    changeScene() {
        //this.scene.start("GameOver");
        console.log("chang scene from react");
    }
}

