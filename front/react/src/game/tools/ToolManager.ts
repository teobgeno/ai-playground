import { Tool, CursorType } from "./types";
import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import Character from "../Character";
import { Land } from "../farm/Land";
import { HoeTool } from "./HoeTool";
import { WateringCanTool } from "./WateringCanTool";
import { CropCursor } from "./CropCursor";

export class ToolManager {
    private map: Tilemaps.Tilemap;
    private hoeTool: Tool;
    private wateringCanTool: WateringCanTool;
    private cropCursor: CropCursor;
    private currentCursor: Tool | null;
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
        this.hoeTool = new HoeTool(
            scene,
            map,
            gridEngine,
            character,
            farmLandMap,
            landsMap,
            marker
        );

        this.wateringCanTool = new WateringCanTool(
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

    public hasActiveTool() {
        return this.currentCursor ? true : false;
    }

    public setActiveTool(selectedToolType: CursorType) {

        if(this.currentCursorType && this.currentCursorType === selectedToolType) {
            selectedToolType = CursorType.NONE;
        }
        
        switch (selectedToolType) {
            case CursorType.HOE:
                this.currentCursor = this.hoeTool;
                this.currentCursorType = CursorType.HOE;
                break;
            case CursorType.CROP:
                    this.currentCursor = this.cropCursor;
                    this.currentCursorType = CursorType.CROP;
                    break;
            case CursorType.WATERING_CAN:
                        this.currentCursor = this.wateringCanTool;
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
