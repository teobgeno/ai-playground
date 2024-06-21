import { EventBus } from "../EventBus";
import { Scene, Tilemaps } from "phaser";
import { GridEngine, GridEngineConfig } from "grid-engine";
import { Hero } from "../characters/Hero";
import { Npc } from "../characters/Npc";
import { Humanoid } from "../characters/Humanoid";
//import { Land } from "../farm/Land";
// import {DayNight} from "../DayNight";
//import { Item } from "../items/item";
import { Hoe } from "../items/Hoe";
import { Seed } from "../farm/Seed";
import { CursorManager } from "../cursors/CursorManager";
import { ChatManager } from "../ChatManager";
import { InventoryItem } from "../characters/types";
//import { LandEntity } from "../farm/types";
import { MapManager } from "../MapManager";
import { Item } from "../items/item";

import { HarvestTask } from "../actions/HarvestTask";
import { Land } from "../farm/Land";
// type gridEngineConfigChar = {
//     id?:string,
//     sprite?:Physics.Arcade.Sprite
//     walkingAnimationMapping?: number
//     startPosition?: { x: number, y: number },
//     speed?: number
// }
// type gridEngineConfig = {
//     characters : Array<gridEngineConfigChar>
// }

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    gameText: Phaser.GameObjects.Text;
    gridEngine: GridEngine;
    hero: Hero;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private map!: Tilemaps.Tilemap;
    private marker: Phaser.GameObjects.Rectangle;

    // private activeTool: number;
    // private propertiesText;
    private charactersMap: Map<string, Humanoid>;
    private cursorManager: CursorManager;
    private chatManager: ChatManager;
    private mapManager: MapManager;
    constructor() {
        super("Game");
    }

    preload() {
        //this.load.baseURL = 'assets/';

        //https://www.html5gamedevs.com/topic/31300-how-to-get-tiled-json-map-into-phaser-json-tile-map-error-cannot-read-property-2-of-undefined/
        //https://newdocs.phaser.io/docs/3.60.0/focus/Phaser.Tilemaps.Tilemap-getTileAt
        //https://labs.phaser.io/edit.html?src=src/tilemap\paint%20tiles.js
        //https://labs.phaser.io/edit.html?src=src/tilemap\tile%20properties.js

        //https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Physics.Matter.PointerConstraint-pointer
        //https://labs.phaser.io/view.html?src=src/input\pointer\drag%20rectangle.js
        //https://labs.phaser.io/edit.html?src=src/tilemap\mouse%20wheel%20zoom.js

        //https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-tilesets (multiple tilesets)
        
        // this.load.image('fences', 'assets/graphics/environment/Fences.png');
        // this.load.image('grass', 'assets/graphics/environment/Grass.png');
        // this.load.image('hills', 'assets/graphics/environment/Hills.png');
        // this.load.image('house', 'assets/graphics/environment/House.png');
        // this.load.image('houseDecoration', 'assets/graphics/environment/House Decoration.png');
        // this.load.image('interaction', 'assets/graphics/environment/interaction.png');
        // this.load.image('paths', 'assets/graphics/environment/Paths.png');
        // this.load.image('plantDecoration', 'assets/graphics/environment/Plant Decoration.png');
        // this.load.image('water', 'assets/graphics/environment/Water.png');
        // this.load.image('objects','assets/graphics/objects/bush.png');
        // this.load.image('objects','assets/graphics/objects/flower.png');
        // this.load.image('objects','assets/graphics/objects/merchant.png');
        // this.load.image('objects','assets/graphics/objects/mushroom.png');
        // this.load.image('objects','assets/graphics/objects/mushrooms.png');
        // this.load.image('objects','assets/graphics/objects/stump_medium.png');
        // this.load.image('objects','assets/graphics/objects/stump_small.png');
        // this.load.image('objects','assets/graphics/objects/sunflower.png');
        // this.load.image('objects','assets/graphics/objects/tree_medium.png');
        // this.load.image('objects','assets/graphics/objects/tree_small.png');
        
     

        // MAP LOADING
        this.load.image({
            key: "tiles",
            url: "assets/tiles/farm.png",
        });
        this.load.tilemapTiledJSON("farm", "assets/tilemaps/farm.json");
        //this.load.tilemapTiledJSON("farm", "assets/tilemaps/map.json");

        //this.load.image('hero', 'assets/sprites/hero.png');
        this.load.spritesheet("hero", "assets/sprites/hero.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        this.load.spritesheet("npc", "assets/sprites/characters.png", {
            frameWidth: 52,
            frameHeight: 72,
        });

        this.load.spritesheet("crops", "assets/sprites/crops/1/crops.png", {
            frameWidth: 32,
            frameHeight: 64,
        });
        this.load.spritesheet("land", "assets/sprites/crops/2/crops.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.atlas(
            "items",
            "assets/sprites/items.png",
            "assets/sprites/items.json"
        );
    }

    create() {
        this.charactersMap = new Map();
        this.initMap();
        this.initHero();
        this.chatManager = new ChatManager(this.charactersMap);
        this.initNpcs();
        this.initGridEngine();
        this.initCamera(this.map);

        // this.propertiesText = this.add.text(
        //     16,
        //     16,
        //     "Click on a tile to view its properties.",
        //     {
        //         font: "20px Arial",
        //         color: "#000",
        //     }
        // );

        //this.marker = this.add.graphics();
        // this.marker.lineStyle(2, 0x000000, 1);
        // this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
        this.marker = this.add.rectangle(
            0,
            0,
            this.map.tileWidth,
            this.map.tileHeight,
            0x000000,
            0
        );
        this.marker.setDepth(10);
        this.marker.setAlpha(0);

        // this.input.on('pointerup', (pointer:any) => {
        //     // Get the WORLD x and y position of the pointer
        //     const {worldX, worldY} = pointer;
        //     console.log(pointer)
        //     const t = this.add.sprite(worldX, worldY, 'items', 'basic_axe');
        //     t.setDepth(1)
        //     // Assign the world x and y to our vector
        //     // const target ={x:0,y:0};
        //     // target.x = worldX;
        //     // target.y = worldY;

        //     // // Position the arrow at our world x and y
        //     // this.arrow.body.reset(worldX, worldY);
        //     // this.arrow.setVisible(true);
        // });

        this.input.on("pointerup", () => {
            this.cursorManager.onPointerUp(
                this.input.activePointer.positionToCamera(this.cameras.main)
            );
        });

        this.input.on("pointermove", () => {
            this.cursorManager.onPointerMove(
                this.input.activePointer.positionToCamera(this.cameras.main)
            );
        });

        
   
        this.cursorManager = new CursorManager(
            this,
            this.map,
            this.mapManager,
            this.gridEngine,
            this.hero,
            this.marker
        );

        // const d = new DayNight(this,0,0,1024,768)
        // d.update(512,384);
        // d.setDepth(4)
        this.test();
        EventBus.emit("current-scene-ready", this);
    }

    private test() {
        
        const s = this.add.sprite(420, 350, 'items', 'wood');
        s.setDepth(1)
       

        this.physics.add.overlap(this.hero, s, ()=>{console.log('sdsad')}, null, this);
        
        // const t = this.map.getLayer('Trees');
        // console.log(t);
        // t.add(s)
    }

    private initMap() {
        this.map = this.make.tilemap({
            key: "farm",
            tileWidth: 32,
            tileHeight: 32,
        });
        
        // const fencesTiles = this.map.addTilesetImage('Fences', 'fences');
        // const grassTiles = this.map.addTilesetImage('Grass', 'grass');
        // const hillsTiles = this.map.addTilesetImage('Hills', 'hills');
        // const houseTiles = this.map.addTilesetImage('House', 'house');
        // const houseDecorationTiles = this.map.addTilesetImage('House Decoration', 'houseDecoration');
        // const interactionTiles = this.map.addTilesetImage('interaction', 'interaction');
        // const pathsTiles = this.map.addTilesetImage('Paths', 'paths');
        // const plantDecorationTiles = this.map.addTilesetImage('Plant Decoration', 'plantDecoration');
        // const waterTiles = this.map.addTilesetImage('Water', 'water');
        // const objectTiles = this.map.addTilesetImage('Objects', 'objects');
        // const allTiles = [fencesTiles,grassTiles,hillsTiles,houseTiles,houseDecorationTiles,interactionTiles,pathsTiles,plantDecorationTiles,waterTiles,objectTiles];
        // console.log(allTiles)
        // console.log(this.map.layers)
        const tilesets = this.map.addTilesetImage("farm", "tiles");
        if (tilesets) {
            // this.map.createLayer("Collision", tilesets, 0, 0);
            for (let i = 0; i < this.map.layers.length; i++) {
                this.map.createLayer( this.map.layers[i].name.toString(), tilesets, 0, 0);
                //const layer = this.map.createLayer(i, tilesets, 0, 0);
                //layer.scale = 3;
            }

            // trees?.setCollisionByProperty({ collides: true });
            // if (trees) {
            //     this.physics.add.collider(this.hero, trees);
            // }

            // trees?.setInteractive(
            //     new Phaser.Geom.Rectangle(0, 0, 32, 64),
            //     Phaser.Geom.Rectangle.Contains
            // );
            // trees?.on("pointerdown", function () {
            //     console.log("arxidia");
            // });

            // for (let i = 0; i < map.layers.length; i++) {
            //     console.log(map.layers[i].name)
            //     const layer = map.createLayer(i, tilesets, 0, 0);
            //     if(map.layers[i].name === 'Trees'){
            //         layer?.setCollisionByProperty({ collides: true });
            //         layer?.setInteractive(new Phaser.Geom.Rectangle(0, 0, 32, 64), Phaser.Geom.Rectangle.Contains);
            //         layer?.on('pointerdown', function () {
            //          console.log('arxidia');

            //         })

            //     }

            // }
        }

        // map.createLayer("Ground", this.tileset, 0, 0);
        // map.createLayer("Trees", this.tileset, 0, 0);
        //treesLayer.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        this.mapManager = new MapManager(this.map);
        this.mapManager.createPlotLandCoords();
        //this.showDebugWalls();
    }

    private initHero() {
        this.hero = new Hero(this, "hero", this.gridEngine, "hero");
        this.hero.getInventory().addItem(new Hoe());
        
        const cornSeed = new Seed(2, 'Corn Seeds');

        const seedCrop = new Item(3,'Corn');
        seedCrop.setIcon('🌽')

        this.hero.getInventory().addItem(
            cornSeed
            .setIsStackable(true)
            .setAmount(4)
            .setIcon('🌱')
            .setGrowthStageDuration(1000)
            .setCurrentGrowthStageFrame(30)
            .setMaxGrowthStageFrame(34)
            .setCrop(seedCrop)
        );

        // this.hero.getInventory().addItem(
        //     new Seed(3, true, 4, "🍅", 8000, 0, 4)
        // );
        // this.hero.getInventory().addItem(
        //     new Seed(4, true, 2, "🌶️", 3000, 20, 24)
        // );

        

        this.physics.add.existing(this.hero);
        this.add.existing(this.hero);
        this.hero.setCollideWorldBounds(true)
        this.hero.init();
        this.charactersMap.set("hero", this.hero);
    }

    private initNpcs() {
        const npc = new Npc(
            this,
            "npc",
            this.gridEngine,
            "npc0",
            this.chatManager
        );
        this.physics.add.existing(npc);
        this.add.existing(npc);
        npc.init();
        this.charactersMap.set("npc0", npc);
    }

    private initGridEngine() {
        const hero = this.charactersMap.get("hero");
        const gridEngineConfig: GridEngineConfig = {
            characters: [
                {
                    id: hero?.getId() || "",
                    sprite: hero,
                    startPosition: { x: 15, y: 10 },
                    // collides: {
                    //     collisionGroups: ['cg1']
                    // }
                    // charLayer: "CharLayer"
                },
            ],
        };

        //const npcSprite = this.add.sprite(0, 0, "npc");
        const npc0 = this.charactersMap.get("npc0");
        if (npc0) {
            gridEngineConfig.characters.push({
                id: npc0.getId(),
                sprite: npc0,
                walkingAnimationMapping: 1,
                startPosition: { x: 12, y: 5 },
                speed: 3,
                // collides: {
                //     collisionGroups: ['cg1']
                // }
            });
            npc0.scale = 0.9;
        }

        this.gridEngine.create(this.map, gridEngineConfig);
        //this.gridEngine.moveRandomly("npc0", 500);

        this.gridEngine.movementStarted().subscribe(({ charId, direction }) => {
            if (charId === "hero") {
                this.hero.anims.play(direction);
            }
        });

        this.gridEngine.movementStopped().subscribe(({ charId, direction }) => {
            if (charId === "hero") {
                this.hero.anims.stop();
                this.hero.setFrame(this.hero.getStopFrame(direction));
            }
        });

        // this.gridEngine
        //     .directionChanged()
        //     .subscribe(({ charId, direction }) => {
              
        //     });

        this.gridEngine
            .positionChangeFinished()
            .subscribe(({ charId, enterTile }) => {
                const char = this.charactersMap.get(charId);
                if (char && char.currentTask) {
                    // console.log(char.currentTask.posX)
                    // console.log(char.currentTask.posY)
                    if (
                        enterTile.x == char.currentTask.getMoveDestinationPoint().x &&
                        enterTile.y == char.currentTask.getMoveDestinationPoint().y
                    ) {
                        char.currentTask.next();
                    }
                }
                // this.posX = enterTile.x
                // this.posY = enterTile.y
                // if (enterTile.x == targetPos.x && enterTile.y == targetPos.y) {
                //   cb()
                // }
            });
    }

    private initCamera(map: Tilemaps.Tilemap): void {
        this.cameras.main.startFollow(this.hero, true, 0.09, 0.09);
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        // this.cameras.main.setSize(
        //     this.map.widthInPixels,
        //     this.map.heightInPixels
        // );
    }

    update(time: number, delta: number): void {
        this.hero.update(delta);
        for (const land of this.mapManager.getPlotLandEntities()) {
            land.update(time);
        }
    }

    setActiveItem(item: InventoryItem) {
        this.cursorManager.setActiveItemCursor(item);
        const enableObjInteractions = this.cursorManager.hasActiveCursor() ? false : true;
        
        //disable interactions to game objects when cursor exists 
        for (const land of this.mapManager.getPlotLandEntities()) {
            land.toggleInteraction(enableObjInteractions);
        }

        for (const [, character] of this.charactersMap) {
            if(character.getId() !== 'hero') {
                (character as Npc).toggleInteraction(enableObjInteractions);
            }
        }
    }

    getHotbarItems() {
        return this.hero.getInventory().getHotbarItems();
        // if(this.activeTool && this.activeTool === tool) {
        //     this.activeTool = 0;
        // } else {
        //     this.activeTool = tool;
        // }
    }

    addPlayerTask(task: string, params : Land) {
        console.log('add harvest task')
        const h = new HarvestTask(
            this.mapManager,
            this.gridEngine,
            this.hero,
            params,
        );
        this.hero.addTask(h);
    }
}
