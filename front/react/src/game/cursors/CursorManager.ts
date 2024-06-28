import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import { MapManager } from "../MapManager";

import { HoeCursor } from "./HoeCursor";
import { WateringCanCursor } from "./WateringCanCursor";
import { CropCursor } from "./CropCursor";
import { FenceCursor } from "./FenceCursor";
import { ExternalInteractionCursor } from "./ExternalInteractionCursor";

import { Cursor, CursorType } from "./types";
import { Storable } from "../items/types";
import { Humanoid } from "../characters/Humanoid";

export class CursorManager {
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private hoeCursor: HoeCursor;
    private wateringCanCursor: WateringCanCursor;
    private cropCursor: CropCursor;
    private fenceCursor: FenceCursor;
    private externalInteractionCursor: ExternalInteractionCursor;
    private currentCursor: Cursor | null;
    private currentCursorType: CursorType;
    private marker: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid,
        marker: Phaser.GameObjects.Rectangle
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

        this.externalInteractionCursor = new ExternalInteractionCursor(
            scene,
            map,
            this.mapManager,
            gridEngine,
            character,
            marker
        );
    }
    public onPointerMove(worldPoint: object | Phaser.Math.Vector2) {
        if (this.currentCursor) {
            const pointerTileX =
                this.map.worldToTileX((worldPoint as Phaser.Math.Vector2).x) ||
                0;
            const pointerTileY =
                this.map.worldToTileY((worldPoint as Phaser.Math.Vector2).y) ||
                0;
            this.currentCursor.onPointerMove(pointerTileX, pointerTileY);
        }
    }

    public onPointerUp(worldPoint: object | Phaser.Math.Vector2) {
        if (this.currentCursor) {
            const pointerTileX =
                this.map.worldToTileX((worldPoint as Phaser.Math.Vector2).x) ||
                0;
            const pointerTileY =
                this.map.worldToTileY((worldPoint as Phaser.Math.Vector2).y) ||
                0;
            this.currentCursor.onPointerUp(pointerTileX, pointerTileY);
        }
    }

    public hasActiveCursor() {
        return this.currentCursor ? true : false;
    }

    public getCurrentCursor() {
        return this.currentCursor;
    }

    public setActiveItemCursor(item: Storable) {
        let selectedToolType = item.getInventory().cursorType;
        if (
            this.currentCursorType &&
            this.currentCursorType === selectedToolType
        ) {
            selectedToolType = CursorType.NONE;
        }

        this.currentCursorType = selectedToolType;

        switch (selectedToolType) {
            case CursorType.HOE:
                this.hoeCursor.setItem(item);
                this.currentCursor = this.hoeCursor;
                break;
            case CursorType.CROP:
                this.cropCursor.setItem(item);
                this.currentCursor = this.cropCursor;
                break;
            case CursorType.WATERING_CAN:
                this.currentCursor = this.wateringCanCursor;
                break;
            case CursorType.FENCE:
                this.currentCursor = this.fenceCursor;
                break;
            case CursorType.EXTERNAL_INTERACTION:
                this.externalInteractionCursor.setItem(item);
                this.currentCursor = this.externalInteractionCursor;
                break;
            default:
                this.currentCursor?.hidePointer();
                this.currentCursor = null;
                break;
        }
        if (this.currentCursorType) {
            this.marker.setAlpha(1);
        }
    }
}
