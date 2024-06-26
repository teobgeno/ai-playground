import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { Hoe } from "../items/Hoe";
import { TillageTask } from "../actions/TillageTask";
import { Land } from "../farm/Land";

import { Storable } from "../items/types";
import { Humanoid } from "../characters/Humanoid";
import { Cursor } from "./types";

export class HoeCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private marker: Phaser.GameObjects.Rectangle;
    private canExecute: boolean = false;
    private hoe: Hoe;

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
        this.marker = marker;
    }

    public setItem(hoe: Storable) {
        this.hoe = hoe as Hoe;
    }

    public hidePointer() {
        this.marker.x = -1000;
        this.marker.y = -1000;
        this.marker.setAlpha(0);
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.marker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.marker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        this.marker.setAlpha(1);
        
        if (
            this.mapManager.isTilePlotExist(pointerTileX, pointerTileY) &&
            !this.mapManager.isTilePlotOccupied(pointerTileX, pointerTileY) &&
            !this.gridEngine.isBlocked({ x: pointerTileX, y: pointerTileY },"CharLayer")
        ) {
            this.canExecute = true;
            this.marker.setStrokeStyle(
                2,
                Phaser.Display.Color.GetColor(0, 153, 0),
                1
            );
        } else {
            this.canExecute = false;
            this.marker.setStrokeStyle(
                2,
                Phaser.Display.Color.GetColor(204, 0, 0),
                1
            );
        }
    }

    public onPointerUp(pointerTileX: number, pointerTileY: number) {
        if (this.canExecute) {
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
                
                const t = new TillageTask(
                    this.mapManager,
                    this.gridEngine,
                    this.character,
                    landEntity,
                    this.hoe
                );
                this.character.addTask(t);
            }
        }
    }
}
