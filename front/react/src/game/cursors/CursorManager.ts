import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import { Land } from "../farm/Land";

import { HoeCursor } from "./HoeCursor";
import { WateringCanCursor } from "./WateringCanCursor";
import { CropCursor } from "./CropCursor";

import { Cursor, CursorType } from "./types";
import { InventoryItem } from "../characters/types";
import {Humanoid} from "../characters/Humanoid";
import {LandEntity} from "../farm/types";

export class CursorManager {
    private map: Tilemaps.Tilemap;
    private hoeCursor: HoeCursor;
    private wateringCanCursor: WateringCanCursor;
    private cropCursor: CropCursor;
    private currentCursor: Cursor | null;
    private currentCursorType: CursorType;
    private marker:Phaser.GameObjects.Rectangle

    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        gridEngine: GridEngine,
        character: Humanoid,
        landsMap: Array<Land>,
        farmLandMap: Map<string, LandEntity>,
        marker:Phaser.GameObjects.Rectangle
    ) {
        
        this.map = map;
        this.marker = marker;
        this.hoeCursor = new HoeCursor(
            scene,
            map,
            gridEngine,
            character,
            landsMap,
            farmLandMap,
            marker
        );

        this.wateringCanCursor = new WateringCanCursor(
            scene,
            map,
            gridEngine,
            character,
            landsMap,
            farmLandMap,
            marker
        );

        this.cropCursor = new CropCursor(
            scene,
            map,
            gridEngine,
            character,
            landsMap,
            farmLandMap,
            marker
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
            default:
                this.currentCursor = null;
                this.currentCursorType = CursorType.NONE;
                this.marker.setAlpha(0);
        }
        if(this.currentCursorType) {
            this.marker.setAlpha(1);
        }
    }
}
