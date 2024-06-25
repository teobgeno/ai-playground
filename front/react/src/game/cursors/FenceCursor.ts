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
    private markers: {[key: string]: Phaser.GameObjects.Sprite};
    private activeMarker:  Phaser.GameObjects.Sprite;
   
    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
        marker: Phaser.GameObjects.Rectangle
    ) {
        this.scene = scene;
        this.map = map;
        this.mapManager = mapManager;
        this.gridEngine = gridEngine;
        this.character = character;


        this.markers['singleColumn'] = this.scene.add.sprite(
            -1000,
            -1000,
            "fence",
            'sprite2'
        ).setDepth(2);
        this.markers['oneRowRight'] = this.scene.add.sprite(
            -1000,
            -1000,
            "fence",
            'sprite8_1'
        ).setDepth(2);

        this.activeMarker = this.markers['singleColumn'];
        //'sprite8_1'
       
   
    }

    // public setItem(hoe: InventoryItem) {
    //     this.hoe = hoe as Hoe;
    // }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.activeMarker.x = (this.map.tileToWorldX(pointerTileX) || 0)+16;
        this.activeMarker.y = (this.map.tileToWorldY(pointerTileY) || 0)+16;
        this.activeMarker.setAlpha(0.4);

        let hasRight = false;
        if(this.mapManager.getPlotLandCoords().get(pointerTileX - 1 + "-" + pointerTileY)?.hasFence) {
            hasRight = true;
           
        }

        if(hasRight) {
            this.activeMarker = this.markers['oneRowRight'];
        } else {
            this.activeMarker = this.markers['singleColumn'];
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
                this.mapManager.setPlotLandCoords(tileGround.x + "-" + tileGround.y, { isWeeded: true, hasCrop: false });

                const landEntity = new Land(
                    this.scene,
                    tileGround.x,
                    tileGround.y,
                    tileGround.pixelX,
                    tileGround.pixelY,
                );
                
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
