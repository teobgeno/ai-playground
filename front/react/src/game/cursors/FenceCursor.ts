import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

// import { Hoe } from "../items/Hoe";
// import { TillageTask } from "../actions/TillageTask";
import { Land } from "../farm/Land";

// import { InventoryItem } from "../characters/types";
import { Humanoid } from "../characters/Humanoid";
import { Cursor } from "./types";

export class FenceCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private markers: {[key: string]: Phaser.GameObjects.Sprite} = {};
    private activeMarker:  Phaser.GameObjects.Sprite;
    private activeMarkerKey: string;
    private activeSprite: string;
   
    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
    ) {
        this.scene = scene;
        this.map = map;
        this.mapManager = mapManager;
        this.gridEngine = gridEngine;
        this.character = character;


        this.markers['singleColumn'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'sprite8_0'
        ).setDepth(2);
        this.markers['oneRowRight'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'sprite8_1'
        ).setDepth(2);

        this.markers['twoRowsRight'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'sprite8_2'
        ).setDepth(2);

        this.markers['twoColumnsVertical'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'sprite4'
        ).setDepth(2);
        
        this.activeMarker = this.markers['singleColumn'];

    }

    // public setItem(hoe: InventoryItem) {
    //     this.hoe = hoe as Hoe;
    // }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.activeMarker.x = (this.map.tileToWorldX(pointerTileX) || 0)+16;
        this.activeMarker.y = (this.map.tileToWorldY(pointerTileY) || 0)+16;
        this.activeMarker.setAlpha(0);

        let hasFence = false;
        if(this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.hasFence) {
            hasFence = true;
        }
        this.activeMarkerKey = 'singleColumn';
        if(this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + ( pointerTileY + 2))?.hasFence) {
            this.activeMarkerKey = 'twoColumnsVertical';
        }

       
        if(this.mapManager.getPlotLandCoords().get((pointerTileX - 2) + "-" + pointerTileY)?.hasFence) {
            this.activeMarkerKey = 'twoRowsRight';
        }

        
        if(this.mapManager.getPlotLandCoords().get((pointerTileX - 1) + "-" + pointerTileY)?.hasFence) {
            this.activeMarkerKey = 'oneRowRight';
        }

      

        this.activeMarker = this.markers[this.activeMarkerKey];
    
        if(!hasFence) {
            this.activeMarker.setAlpha(0.4);
        }
       
        
        if (
            !this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
            !this.gridEngine.isBlocked(
                { x: pointerTileX, y: pointerTileY },
                "CharLayer"
            )
        ) {
            // this.marker.setStrokeStyle(
            //     2,
            //     Phaser.Display.Color.GetColor(0, 153, 0),
            //     1
            // );
        } else {
            // this.marker.setStrokeStyle(
            //     2,
            //     Phaser.Display.Color.GetColor(204, 0, 0),
            //     1
            // );
        }
    }

    public onPointerUp(pointerTileX: number, pointerTileY: number) {
        if (
            !this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
            !this.gridEngine.isBlocked(
                { x: pointerTileX, y: pointerTileY },
                "CharLayer"
            )
        ) {
            const tileGround = this.map.getTileAt(
                pointerTileX,
                pointerTileY,
                false,
                "Ground"
            );
            
            if (tileGround) {
                this.mapManager.updatePlotLandCoords(tileGround.x + "-" + tileGround.y, { hasFence: true });

                console.log(this.activeMarker )
                const landEntity = new Land(
                    this.scene,
                    tileGround.x,
                    tileGround.y,
                    tileGround.pixelX,
                    tileGround.pixelY,
                );
               
                let padX = 16;
                let padY = 16;

                if(this.activeMarkerKey === 'oneRowRight') {
                    padX = 7;
                }

                if(this.activeMarkerKey === 'twoRowsRight') {
                    padX = -2;
                }

                if(this.activeMarkerKey === 'twoColumnsVertical') {
                    padY = 48;

                }

                this.scene.add.sprite(
                    tileGround.pixelX+padX,
                    tileGround.pixelY+padY,
                    "fence",
                    this.activeMarker.frame.customData.filename
                ).setDepth(2)

                tileGround.properties={ge_collide:true}
                
                // const t = new TillageTask(
                //     this.mapManager,
                //     this.gridEngine,
                //     this.character,
                //     landEntity,
                //     this.hoe
                // );
                // this.character.addTask(t);
            }
        }
    }
}
