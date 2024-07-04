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
       
    }
    
    create() {
        console.log(data)
        this.input.mouse?.disableContextMenu();
        this.charactersMap = new Map();
        this.initMap();
        this.initHero();
        this.chatManager = new ChatManager(this.charactersMap);
        this.initNpcs();
        this.initGridEngine();
        this.initCamera(this.map);

      
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


      
        // setTimeout(() => {
        //     this.scene.restart({ level: 1 });
        //   }, 4000);
        // this.test();
        EventBus.emit("current-scene-ready", this);
    }

    private test() {
        //landTiles

        const stoneItem = new Rock(this, this.mapManager, {x:11, y:16, pixelX:(this.map.tileToWorldX(11) || 0), pixelY:(this.map.tileToWorldX(16) || 0)});
        stoneItem.setResource(new GenericItem(ObjectId.Stone, "stone", new InventoryItem().setIcon('https://assets.codepen.io/7237686/stone.svg?format=auto')));

        const treeItem = new Tree(this, this.mapManager, {x:11, y:10, pixelX:(this.map.tileToWorldX(11) || 0), pixelY:(this.map.tileToWorldY(10) || 0)});
        treeItem.setResource(new GenericItem(ObjectId.Wood, "wood", new InventoryItem().setIcon('https://assets.codepen.io/7237686/wood.svg?format=auto')));


        return;
        const s = this.add.sprite(420+16, 350+16, 'items', 'wood');
       
        this.physics.add.existing(s);
       (s.body as Phaser.Physics.Arcade.Body ).setSize(s.width/2, s.height / 2, true);
       (s.body as Phaser.Physics.Arcade.Body ).immovable = true;
       (s.body as Phaser.Physics.Arcade.Body ).onCollide = true;
        //this.hero.setCollideWorldBounds(true)

        s.setDepth(2)

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
        this.mapManager = new MapManager(this.map);
        this.mapManager.createPlotLandCoords();
        //this.showDebugWalls();
    }

    private initHero() {
        this.hero = new Hero(this, "hero", this.gridEngine, "hero");
      
        const hoe = new Hoe(
            new InventoryItem()
            .setIcon('https://assets.codepen.io/7237686/iridium_hoe.svg?format=auto')
            .setIsStackable(false)
            .setAmount(1)
            .setCursorType(CursorType.HOE)
        )

        const pickAxe = new PickAxe(
            new InventoryItem()
            .setIcon('https://assets.codepen.io/7237686/iridium_pickaxe.svg?format=auto')
            .setIsStackable(false)
            .setAmount(1)
            .setCursorType(CursorType.EXTERNAL_INTERACTION)
        )

        const seedCrop = new GenericItem(ObjectId.Corn,'Corn', new InventoryItem().setIcon('https://assets.codepen.io/7237686/corn.svg?format=auto'));
        const cornSeed = new Seed(ObjectId.CornSeed, 'Corn Seeds', 
            new InventoryItem()
            .setIsStackable(true)
            .setAmount(4).setIcon('https://assets.codepen.io/7237686/poppy_seeds.svg?format=auto')
            .setCursorType(CursorType.CROP)
        )
        .setGrowthStageDuration(1000)
        .setCurrentGrowthStageFrame(30)
        .setMaxGrowthStageFrame(34)
        .setCrop(seedCrop);
       

        const fencePart = new GenericItem(ObjectId.Fence, 'Fence', 
            new InventoryItem().setIsStackable(true)
            .setAmount(4)
            .setIcon('https://stardewvalleywiki.com/mediawiki/images/1/1e/Wood_Fence.png')
            .setCursorType(CursorType.FENCE)
        );

        this.hero.getInventory().addItem(hoe);
        this.hero.getInventory().addItem(pickAxe);
        this.hero.getInventory().addItem(cornSeed);
        this.hero.getInventory().addItem(fencePart);
   
        
        this.physics.add.existing(this.hero);
        this.add.existing(this.hero);
        this.hero.setCollideWorldBounds(true);
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
        for (const item of this.mapManager.getMapObjects()) {
            if (typeof item?.update !== "undefined") { 
                item.update(time);
            }
        }
    }

    setActiveItem(item: Storable) {
        this.cursorManager.setActiveItemCursor(item);
        const enableObjInteractions = this.cursorManager.hasActiveCursor() ? false : true;
        
        //disable interactions to game objects when cursor exists 
        // for (const land of this.mapManager.getPlotLandEntities()) {
        //     land.toggleInteraction(enableObjInteractions);
        // }

        this.mapManager.getPlotLandCoords().forEach((item)=>{
            //item.toggleInteraction(enableObjInteractions);
            if (typeof item?.setExternalActiveCursor !== "undefined") { 
                item?.setExternalActiveCursor(this.cursorManager.getCurrentCursor());
            }
        })

        for (const [, character] of this.charactersMap) {
            if(character.getId() !== 'hero') {
                (character as Npc).toggleInteraction(enableObjInteractions);
            }
        }
    }

    getHotbarItems() {
        return this.hero.getInventory().getHotbarItems();
    }

    getInventoryItems(hotbar: boolean) {
        if(hotbar) {
            return this.hero.getInventory().getHotbarItems();
        } else {
            return this.hero.getInventory().getRestItems()
        }
    }

    addPlayerTask(task: string, params : MapObject) {
        console.log('add harvest task')
        const h = new HarvestTask(
            this.mapManager,
            this.gridEngine,
            this.hero,
            params as FarmLand,
        );
        this.hero.addTask(h);
    }
}
