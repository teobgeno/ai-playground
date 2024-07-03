import { EventBus } from "../EventBus";
import { Scene, Tilemaps } from "phaser";
import { GridEngine, GridEngineConfig } from "grid-engine";
import { Hero } from "../characters/Hero";
import { Npc } from "../characters/Npc";
import { Humanoid } from "../characters/Humanoid";
import { Hoe } from "../items/Hoe";
import { PickAxe } from "../items/PickAxe";
import { Seed } from "../farm/Seed";
import { CursorManager } from "../cursors/CursorManager";
import { ChatManager } from "../ChatManager";
import { Storable } from "../items/types";

import { MapManager } from "../MapManager";

import { InventoryItem } from "../items/InventoryItem"
import { GenericItem } from "../items/GenericItem";
import { Rock } from "../items/Rock";
import { Tree } from "../items/Tree";

import { HarvestTask } from "../actions/HarvestTask";
import { FarmLand } from "../farm/FarmLand";
import { CursorType } from "../cursors/types";
import { MapObject, ObjectId } from "../core/types";


export class OutDoor extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
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
        super("OutDoor");
    }

    preload() {
       
    }

    init(data) {
        console.log(data)
        this.hero = data.hero;
        this.charactersMap = data.charactersMap;
        this.cursorManager = data.cursorManager;
        this.mapManager = data.mapManager;
        
    }

    create() {
        
        //this.input.mouse?.disableContextMenu();
      
        this.initMap();
        this.initGridEngine();
        this.initCamera(this.map);
      
        //EventBus.emit("current-scene-ready", this);
    }

    private initMap() {
        this.map = this.make.tilemap({
            key: "farm",
            tileWidth: 32,
            tileHeight: 32,
        });
        
      
        const tilesets = this.map.addTilesetImage("farm", "tiles");
        if (tilesets) {

            for (let i = 0; i < this.map.layers.length; i++) {
                this.map.createLayer( this.map.layers[i].name.toString(), tilesets, 0, 0);
            }

        }

        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );

        // this.mapManager = new MapManager(this.map);
        // this.mapManager.createPlotLandCoords();
        //this.showDebugWalls();
    }

    private initGridEngine() {
      
        const hero = this.charactersMap.get("hero");
        console.log(this.hero)
        this.hero.setGridEngine(this.gridEngine);
        this.hero.setScene(this);
        this.physics.add.existing(this.hero);
        this.add.existing(this.hero);
        this.hero.setCollideWorldBounds(true)
        this.hero.init();
      
        const gridEngineConfig: GridEngineConfig = {
            cacheTileCollisions: false,
            characters: [
                {
                    id: hero?.getId() || "",
                    sprite: hero,
                    startPosition: { x: 15, y: 10 },
                    speed:4
                },
            ],
        };


        // const npc0 = this.charactersMap.get("npc0");
        // if (npc0) {
        //     gridEngineConfig.characters.push({
        //         id: npc0.getId(),
        //         sprite: npc0,
        //         walkingAnimationMapping: 1,
        //         startPosition: { x: 12, y: 5 },
        //         speed: 3,
        //     });
        //     npc0.scale = 0.9;
        // }

        this.gridEngine.create(this.map, gridEngineConfig);

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
            .positionChangeFinished()
            .subscribe(({ charId, enterTile }) => {
                const char = this.charactersMap.get(charId);

                if (char && char.currentTask) {
                    if (
                        enterTile.x == char.currentTask.getMoveDestinationPoint().x &&
                        enterTile.y == char.currentTask.getMoveDestinationPoint().y
                    ) {
                        char.currentTask.next();
                    }
                }
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
    }

    update(time: number, delta: number): void {
        this.hero.update(delta);
        // for (const item of this.mapManager.getMapObjects()) {
        //     if (typeof item?.update !== "undefined") { 
        //         item.update(time);
        //     }
        // }
    }

}
