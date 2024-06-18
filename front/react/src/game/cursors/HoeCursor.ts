import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { Hoe } from "../items/Hoe";
import { TillageTask } from "../actions/TillageTask";
import { Land } from "../farm/Land";

import { InventoryItem } from "../characters/types";
import { Humanoid } from "../characters/Humanoid";
import { Cursor } from "./types";
import {LandEntity} from "../farm/types";

export class HoeCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private marker: Phaser.GameObjects.Rectangle;
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

    public setItem(hoe: InventoryItem) {
        this.hoe = hoe as Hoe;
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.marker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.marker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        this.marker.setAlpha(1);
        
        if (
            !this.mapManager.getPlotLandCoords().get(pointerTileX + "-" + pointerTileY)?.isWeeded &&
            !this.gridEngine.isBlocked(
                { x: pointerTileX, y: pointerTileY },
                "CharLayer"
            )
        ) {
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
