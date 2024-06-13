import { EventBus } from "../EventBus";
import { Scene, Tilemaps, Physics } from "phaser";
import { GridEngine, GridEngineConfig } from "grid-engine";
import { Hero } from "../characters/Hero";
import { Npc } from "../characters/Npc";
import { Humanoid } from "../characters/Humanoid";
import { Land } from "../farm/Land";
// import {DayNight} from "../DayNight";
import { Hoe } from "../tools/Hoe";
import { Seed } from "../farm/Seed";
import { CursorManager } from "../cursors/CursorManager";
import { ChatManager } from "../ChatManager";
import { InventoryItem } from "../characters/types";
import { LandEntity } from "../farm/types";

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

    private activeTool: number;
    private propertiesText;

    private charactersMap: Map<string, Humanoid>;
    private landsMap: Array<Land> = [];
    private farmLandMap: Map<string, LandEntity>;
    private cursorManager: CursorManager;
    private chatManager: ChatManager;
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

        this.propertiesText = this.add.text(
            16,
            16,
            "Click on a tile to view its properties.",
            {
                font: "20px Arial",
                color: "#000",
            }
        );

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

        this.farmLandMap = new Map();

        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tileGround = this.map.getTileAt(x, y, false, "Ground");

                const tileTree = this.map.getTileAt(x, y, false, "Trees");

                if (tileGround && !tileTree) {
                    this.farmLandMap.set(x + "-" + y, {
                        isWeeded: false,
                        hasCrop: false,
                    });
                }
            }
        }

        this.cursorManager = new CursorManager(
            this,
            this.map,
            this.gridEngine,
            this.hero,
            this.landsMap,
            this.farmLandMap,
            this.marker
        );

        // const d = new DayNight(this,0,0,1024,768)
        // d.update(512,384);
        // d.setDepth(4)
        EventBus.emit("current-scene-ready", this);
    }

    private initMap() {
        this.map = this.make.tilemap({
            key: "farm",
            tileWidth: 32,
            tileHeight: 32,
        });
        const tilesets = this.map.addTilesetImage("farm", "tiles");
        if (tilesets) {
            // this.map.createLayer("Collision", tilesets, 0, 0);
            // this.map.createLayer("Trees", tilesets, 0, 0);
            // this.map.createLayer("Ground", tilesets, 0, 0);
            for (let i = 0; i < this.map.layers.length; i++) {
                const layer = this.map.createLayer(i, tilesets, 0, 0);
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
        //this.showDebugWalls();
    }

    private initHero() {
        this.hero = new Hero(this, "hero", this.gridEngine, "hero");
        this.hero.getInventory().addItem(new Hoe());
        this.hero.getInventory().addItem(
            new Seed(2, true, 4, "🌽", 1000, 30, 34)
        );
        this.hero.getInventory().addItem(
            new Seed(3, true, 4, "🍅", 8000, 0, 4)
        );

        this.physics.add.existing(this.hero);
        this.add.existing(this.hero);
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

        this.gridEngine
            .directionChanged()
            .subscribe(({ charId, direction }) => {
                //this.hero.setFrame(this.hero.getStopFrame(direction));
            });

        this.gridEngine
            .positionChangeFinished()
            .subscribe(({ charId, enterTile }) => {
                const char = this.charactersMap.get(charId);
                if (char && char.currentTask) {
                    // console.log(char.currentTask.posX)
                    // console.log(char.currentTask.posY)
                    if (
                        enterTile.x == char.currentTask.getTile().x &&
                        enterTile.y == char.currentTask.getTile().y
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
        for (const land of this.landsMap) {
            land.update(time);
        }
    }

    setActiveItem(item: InventoryItem) {
        this.cursorManager.setActiveItemCursor(item);
    }

    getHotbarItems() {
        return this.hero.getInventory().getHotbarItems();
        // if(this.activeTool && this.activeTool === tool) {
        //     this.activeTool = 0;
        // } else {
        //     this.activeTool = tool;
        // }
    }
}
