import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import { MapManager } from "../MapManager";

import { HoeCursor } from "./HoeCursor";
import { WateringCanCursor } from "./WateringCanCursor";
import { CropCursor } from "./CropCursor";
import { FenceCursor } from "./FenceCursor";

import { Cursor, CursorType } from "./types";
import { InventoryItem } from "../characters/types";
import {Humanoid} from "../characters/Humanoid";

export class CursorManager {
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private hoeCursor: HoeCursor;
    private wateringCanCursor: WateringCanCursor;
    private cropCursor: CropCursor;
    private fenceCursor: FenceCursor;
    private currentCursor: Cursor | null;
    private currentCursorType: CursorType;
    private marker:Phaser.GameObjects.Rectangle

    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
        marker:Phaser.GameObjects.Rectangle
    ) {
        
        this.map = map;
        this.mapManager = mapManager;
        this.marker = marker;
        this.hoeCursor = new HoeCursor(
            scene,
            map,
            this.mapManager,
            gridEngine,
            character,
            marker
        );

        this.wateringCanCursor = new WateringCanCursor(
            scene,
            map,
            this.mapManager,
            gridEngine,
            character,
            marker
        );

        this.cropCursor = new CropCursor(
            scene,
            map,
            this.mapManager,
            gridEngine,
            character,
            marker
        );

        this.fenceCursor = new FenceCursor(
            scene,
            map,
            this.mapManager,
            gridEngine,
            character
        );
    }
    public onPointerMove(worldPoint: object | Phaser.Math.Vector2) {
        if(this.currentCursor) {
            const pointerTileX = this.map.worldToTileX((worldPoint as Phaser.Math.Vector2).x) || 0;
            const pointerTileY = this.map.worldToTileY((worldPoint as Phaser.Math.Vector2).y) || 0;
            this.currentCursor.onPointerMove(pointerTileX, pointerTileY);
        }
    }

    public onPointerUp(worldPoint: object | Phaser.Math.Vector2) {
        if(this.currentCursor) {
            const pointerTileX = this.map.worldToTileX((worldPoint as Phaser.Math.Vector2).x) || 0;
            const pointerTileY = this.map.worldToTileY((worldPoint as Phaser.Math.Vector2).y) || 0;
            this.currentCursor.onPointerUp(pointerTileX, pointerTileY);
        }
    }

    public hasActiveCursor() {
        return this.currentCursor ? true : false;
    }

    public setActiveItemCursor(item: InventoryItem) {
        let selectedToolType = item.cursorType
        if(this.currentCursorType && this.currentCursorType === selectedToolType) {
            selectedToolType = CursorType.NONE;
        }
        
        switch (selectedToolType) {
            case CursorType.HOE:
                this.hoeCursor.setItem(item)
                this.currentCursor = this.hoeCursor;
                this.currentCursorType = CursorType.HOE;
                break;
            case CursorType.CROP:
                    this.cropCursor.setItem(item)
                    this.currentCursor = this.cropCursor;
                    this.currentCursorType = CursorType.CROP;
                    break;
            case CursorType.WATERING_CAN:
                        this.currentCursor = this.wateringCanCursor;
                        this.currentCursorType = CursorType.WATERING_CAN;
                        break;
            case CursorType.FENCE:
                        this.currentCursor = this.fenceCursor;
                        this.currentCursorType = CursorType.FENCE;
                        break;
            default:
                this.currentCursor?.hidePointer();
                this.currentCursor = null;
                this.currentCursorType = CursorType.NONE;
        }
        if(this.currentCursorType) {
            this.marker.setAlpha(1);
        }
    }
}
