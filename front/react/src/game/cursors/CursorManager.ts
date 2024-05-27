import { Cursor, CursorType } from "./types";
import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import Character from "../Character";
import { Land } from "../farm/Land";
import { HoeCursor } from "./HoeCursor";
import { WateringCanCursor } from "./WateringCanCursor";
import { CropCursor } from "./CropCursor";

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
        character: Character,
        farmLandMap: Map<string, string>,
        landsMap: Array<Land>,
        marker:Phaser.GameObjects.Rectangle
    ) {
        
        this.map = map;
        this.marker = marker;
        this.hoeCursor = new HoeCursor(
            scene,
            map,
            gridEngine,
            character,
            farmLandMap,
            landsMap,
            marker
        );

        this.wateringCanCursor = new WateringCanCursor(
            scene,
            map,
            gridEngine,
            character,
            farmLandMap,
            landsMap,
            marker
        );

        this.cropCursor = new CropCursor(
            scene,
            map,
            gridEngine,
            character,
            farmLandMap,
            landsMap,
            marker
        );
    }
    public onPointerMove(worldPoint: object | Phaser.Math.Vector2) {
        if(this.currentCursor) {
            const pointerTileX = this.map.worldToTileX(worldPoint.x) || 0;
            const pointerTileY = this.map.worldToTileY(worldPoint.y) || 0;
            this.currentCursor.onPointerMove(pointerTileX, pointerTileY);
        }
    }

    public onPointerUp(worldPoint: object | Phaser.Math.Vector2) {
        if(this.currentCursor) {
            const pointerTileX = this.map.worldToTileX(worldPoint.x) || 0;
            const pointerTileY = this.map.worldToTileY(worldPoint.y) || 0;
            this.currentCursor.onPointerUp(pointerTileX, pointerTileY);
        }
    }

    public hasActiveCursor() {
        return this.currentCursor ? true : false;
    }

    public cursorManager(selectedToolType: CursorType) {

        if(this.currentCursorType && this.currentCursorType === selectedToolType) {
            selectedToolType = CursorType.NONE;
        }
        
        switch (selectedToolType) {
            case CursorType.HOE:
                this.currentCursor = this.hoeCursor;
                this.currentCursorType = CursorType.HOE;
                break;
            case CursorType.CROP:
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
