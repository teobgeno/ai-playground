import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { Storable } from "../items/types";
import { Character } from "../characters/types";
import { Cursor } from "./types";
import { Utils } from "../core/Utils";

export class PlaceItemCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Character;
    private marker: Phaser.GameObjects.Rectangle;
    private canExecute: boolean = false;
    private item: Storable;
    private activeMarker: Phaser.GameObjects.Sprite | null;

    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Character,
        marker: Phaser.GameObjects.Rectangle
    ) {
        this.scene = scene;
        this.map = map;
        this.mapManager = mapManager;
        this.gridEngine = gridEngine;
        this.character = character;
        this.marker = marker;
    }

    public setItem(item: Storable) {
        this.item = item;
    }

    public setCursorImage() {

        this.activeMarker = this.scene.add
        .sprite(-1000, -1000,'map', 'tree')
        .setDepth(8);
        
        return;

        const imgName = this.item
            .getInventory()
            .icon.substr(this.item.getInventory().icon.lastIndexOf("/") + 1);
        if (!imgName || imgName == "") return this;

        if (!this.scene.textures.exists(imgName)) {
            this.scene.load.svg(imgName, this.item.getInventory().icon, {
                scale: 1.1,
            });
            this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
                this.activeMarker = this.scene.add
                    .sprite(-1000, -1000, imgName)
                    .setDepth(8);
            });
            this.scene.load.start();
        } else {
            this.activeMarker = this.scene.add
                .sprite(-1000, -1000, imgName)
                .setDepth(8);
        }
    }

    public getItem() {
        return this.item;
    }

    public setCanExecute(canExecute: boolean) {
        this.canExecute = canExecute;
        this.activeMarker?.setAlpha(canExecute ? 1 : 0.4);
    }

    public hidePointer() {
        this.marker.x = -1000;
        this.marker.y = -1000;
        this.marker.setAlpha(0);
        this.activeMarker?.destroy();
        this.activeMarker = null;
        this.canExecute = false;
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
      
        this.marker.setAlpha(1);
        if(this.activeMarker) {
            const dp = 3 + Utils.shiftPad(this.activeMarker?.y + this.activeMarker?.displayHeight/2, 7);
            this.activeMarker?.setDepth(dp);
        }
      
        const b = this.activeMarker?.getBounds();
        let checkPoints = [];
        if(b) {
            checkPoints = [
                {x: b.x, y: ( (b.y + b.height))},
                {x: (b.x + 32), y: ( (b.y + b.height))},
                {x: (b.x + 64), y: ( (b.y + b.height))},
                {x: (b.x + 96), y: ( (b.y + b.height))},
            ]
        }
        const key  = 3;
        this.marker.x = (checkPoints[key].x || 0);
        this.marker.y = (checkPoints[key].y || 0);

       
        if (this.activeMarker) {
            this.activeMarker.setAlpha(0.4);
            this.activeMarker.x =
                (this.map.tileToWorldX(pointerTileX) || 0) + 16;
            this.activeMarker.y =
                (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        }
        let hasObstacle = false;
        for (const element of checkPoints) {
            const mapObj = this.mapManager.getPlotLandCoord(this.map.worldToTileX(element.x) || 0, this.map.worldToTileY(element.y) || 0); 
          
            if(
                mapObj !== null
                
            ) {
                hasObstacle = true;
            }
        }
        console.log(hasObstacle)
        this.canExecute = !hasObstacle;
        if (this.canExecute) {
            this.activeMarker?.setAlpha(1);
            this.marker.setStrokeStyle(
                2,
                Phaser.Display.Color.GetColor(0, 153, 0),
                1
            );
        } else {
            this.marker.setStrokeStyle(
                2,
                Phaser.Display.Color.GetColor(204, 0, 0),
                1
            );
        }
    }

    public onPointerUp(pointerTileX: number, pointerTileY: number) {
        if (this.canExecute) {
            const landItem = this.mapManager.getPlotLandCoord(
                pointerTileX,
                pointerTileY
            );
            if (landItem) {
                if (typeof landItem?.getInteractive !== "undefined") {
                    landItem?.getInteractive().interactWithItem();
                }
                if (typeof landItem?.getDestruct !== "undefined") {
                    console.log(landItem?.getDestruct());
                    const resources = landItem?.getDestruct().getResources();
                    for (const resource of resources) {
                        this.character.getInventory().addItem(resource);
                    }
                    this.canExecute = false;
                }
            }
        }
    }
}
