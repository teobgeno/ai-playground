import { EventBus } from "../EventBus";
import { Scene, Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import Character from "../Character";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    gameText: Phaser.GameObjects.Text;
    gridEngine: GridEngine;
    hero: Character;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private map!: Tilemaps.Tilemap;
    private marker: Phaser.GameObjects.Graphics;
    private charToolsMap: Map<number, object>;
    private activeTool: number;
    private propertiesText;
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
        this.initMap();
        this.initHero();
        this.initGridEngine();
        this.initCamera(this.map);

        this.propertiesText = this.add.text(16, 16, "Click on a tile to view its properties.", {
            font: "20px Arial",
            color: "#000",
        });

        this.marker = this.add.graphics();
        this.marker.lineStyle(2, 0x000000, 1);
        this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
        this.marker.setDepth(1);
        this.marker.setAlpha(0);

        this.charToolsMap = new Map();
        this.charToolsMap.set(1, { id: 1, title: "hoe" });

        EventBus.emit("current-scene-ready", this);

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
    }

    private initMap() {
        this.map = this.make.tilemap({
            key: "farm",
            tileWidth: 32,
            tileHeight: 32,
        });
        const tilesets = this.map.addTilesetImage("farm", "tiles");
        if (tilesets) {
            this.map.createLayer("Ground", tilesets, 0, 0);
            this.map.createLayer("Trees", tilesets, 0, 0);
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
        this.hero = new Character(this, "hero", this.gridEngine, "hero");
        this.physics.add.existing(this.hero);
        this.add.existing(this.hero);
        this.hero.init();
        
       
    }

    private initGridEngine() {
        const gridEngineConfig = {
            characters: [
                {
                    id: "hero",
                    sprite: this.hero,
                    startPosition: { x: 15, y: 10 },
                },
            ],
        };
        this.gridEngine.create(this.map, gridEngineConfig);

        this.gridEngine.movementStarted().subscribe(({ charId, direction }) => {
            this.hero.anims.play(direction);
        });

        this.gridEngine.movementStopped().subscribe(({ charId, direction }) => {
            this.hero.anims.stop();
            this.hero.setFrame(this.hero.getStopFrame(direction));
        });

        this.gridEngine
            .directionChanged()
            .subscribe(({ charId, direction }) => {
                this.hero.setFrame(this.hero.getStopFrame(direction));
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

    private checkActiveTool() {
        if (this.activeTool === 1) {
            //https://labs.phaser.io/edit.html?src=src/input\camera\world%20coordinates.js
            const worldPoint = this.input.activePointer.positionToCamera(
                this.cameras.main
            );

            // Rounds down to nearest tile
            const pointerTileX = this.map.worldToTileX(worldPoint.x) || 0;
            const pointerTileY = this.map.worldToTileY(worldPoint.y) || 0;

            // Snap to tile coordinates, but in world space
            this.marker.x = this.map.tileToWorldX(pointerTileX) || 0;
            this.marker.y = this.map.tileToWorldY(pointerTileY) || 0;

            this.marker.setAlpha(1);

            if (this.input.manager.activePointer.isDown) {
                //get tile from all leyer if ground is clear continue
                const tileGround = this.map.getTileAt(
                    pointerTileX,
                    pointerTileY,
                    false,
                    "Ground"
                );
                const tileTree = this.map.getTileAt(
                    pointerTileX,
                    pointerTileY,
                    false,
                    "Trees"
                );

                if (tileGround && !tileTree) {
                    // Note: JSON.stringify will convert the object tile properties to a string
                    this.propertiesText.setText(
                        `Properties: ${JSON.stringify(tileGround.properties)}`
                    );
                    //tile.properties.viewed = true;
                    const t = this.add.sprite(
                        tileGround.pixelX + 16,
                        tileGround.pixelY + 16,
                        "items",
                        "wheat"
                    );
                    t.setDepth(1);
                    console.log(tileGround.x + "---" + tileGround.y);
                    this.gridEngine.moveTo("hero", {
                        x: tileGround.x,
                        y: tileGround.y,
                    });

                    //pixelX
                }

                //  this.map.putTileAt(this.selectedTile, pointerTileX, pointerTileY);
            }
        }
    }

    update(t: number, dt: number): void {
        this.checkActiveTool();
        this.hero.update(dt);
    }

    setActiveTool(tool: number) {
        //this.scene.start("GameOver");
        console.log("chang scene from react");
        if(this.activeTool && this.activeTool === tool) {
            this.activeTool = 0;
        } else {
            this.activeTool = tool;
        }
        
    }
}
