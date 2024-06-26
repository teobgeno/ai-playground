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


        this.markers['singlePole'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'pole'
        ).setDepth(1.1);
        this.markers['oneRowRight'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'side_right'
        ).setDepth(1.1);

        this.markers['oneRowLeft'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'side_left'
        ).setDepth(1.1);

        this.markers['oneRowBoth'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'side_both'
        ).setDepth(1.1);
    
        this.markers['oneColumnUp'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'column_up'
        ).setDepth(1.1);

        this.markers['oneColumnDown'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'column_down'
        ).setDepth(1.2);

        this.markers['oneColumnBoth'] = this.scene.add.sprite(
            -1000,
            -1000,
            'fence',
            'sprite4'
        ).setDepth(1);
        
        this.activeMarker = this.markers['singlePole'];

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
        this.activeMarkerKey = 'singlePole';

        if(this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + ( pointerTileY - 1))?.hasFence) {
            this.activeMarkerKey = 'oneColumnDown';
        }

        if(this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + ( pointerTileY + 1))?.hasFence) {
            this.activeMarkerKey = 'oneColumnUp';
        }

       
        if(this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + ( pointerTileY - 1))?.hasFence
        && this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + ( pointerTileY + 1))?.hasFence
    ) {
            this.activeMarkerKey = 'oneColumnBoth';
        }

       
        if(this.mapManager.getPlotLandCoords().get((pointerTileX - 1) + "-" + pointerTileY)?.hasFence) {
            this.activeMarkerKey = 'oneRowRight';
        }

        if(this.mapManager.getPlotLandCoords().get((pointerTileX + 1) + "-" + pointerTileY)?.hasFence) {
            this.activeMarkerKey = 'oneRowLeft';
        }


        if(this.mapManager.getPlotLandCoords().get((pointerTileX - 1) + "-" + pointerTileY)?.hasFence 
        && this.mapManager.getPlotLandCoords().get((pointerTileX + 1) + "-" + pointerTileY)?.hasFence) {
            this.activeMarkerKey = 'oneRowBoth';
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

                if(this.activeMarkerKey === 'oneRowLeft') {
                    padX = 25;
                }

                if(this.activeMarkerKey === 'oneColumnDown') {
                    padY = 0;
                }

                console.log(padY)

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
