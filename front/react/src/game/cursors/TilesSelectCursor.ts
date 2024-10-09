import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { Storable } from "../items/types";
import { Character } from "../characters/types";
import { Cursor } from "./types";
import { MapObject } from "../core/types";

export class TilesSelectCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private marker: Phaser.GameObjects.Rectangle;
    private canExecute: boolean = false;
    private activeMarker: Phaser.GameObjects.Sprite | null;
    private selectedItems : Array<MapObject> = [];

    public graphics: Phaser.GameObjects.Graphics;
    public isDrawing: boolean = false;
    public startPoint: { x: number, y: number } = { x: 0, y: 0 };
    public currentRect: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 0, height: 0 };


    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        mapManager: MapManager,
        marker: Phaser.GameObjects.Rectangle
    ) {
        this.scene = scene;
        this.map = map;
        this.mapManager = mapManager;
        this.marker = marker;
        this.graphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } });
        this.graphics.setDepth(10);
    }

    public setCanExecute(canExecute: boolean) {
       return false;
    }

    public hidePointer() {
        this.isDrawing = false;
        this.graphics.clear();
        this.currentRect.x = 0; 
        this.currentRect.y = 0;
        this.currentRect.width = 0;
        this.currentRect.height = 0;
        this.selectedItems = [];
    }

    public onPointerDown(pointerTileX: number, pointerTileY: number) {

        this.startPoint.x = pointerTileX;
        this.startPoint.y = pointerTileY;
        this.isDrawing = true;
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {

        if (this.isDrawing) {
            
            const width = (this.map.tileToWorldX(pointerTileX) || 0) - this.startPoint.x;
            const height = (this.map.tileToWorldY(pointerTileY) || 0) - this.startPoint.y;

            this.currentRect.x = this.startPoint.x;
            this.currentRect.y = this.startPoint.y;
            this.currentRect.width = width;
            this.currentRect.height = height;
        }
    
    }

    public onPointerUp(pointerTileX: number, pointerTileY: number) {
        if(this.isDrawing) {
            const inRec:Array<number> = [];
            for (let xPos = this.currentRect.x; xPos < (this.currentRect.x + this.currentRect.width); xPos ++) {
                for (let yPos = this.currentRect.y; yPos < (this.currentRect.y + this.currentRect.height); yPos ++) {
                    const mapObj = this.mapManager.getPlotLandCoord(pointerTileX, pointerTileY); 
                    if(mapObj !== null && mapObj !== undefined) {
                        if(!inRec.includes(mapObj.id + mapObj.objectId)) {
                            inRec.push(mapObj.id + mapObj.objectId);
                            this.selectedItems.push(mapObj);
                        }
                    }
                }
            }

            console.log(this.selectedItems)
            this.isDrawing = false;
        }
    }
}
