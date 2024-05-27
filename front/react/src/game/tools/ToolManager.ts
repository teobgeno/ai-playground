import { Tool, ToolType } from "./types";
import { Tilemaps } from "phaser";
import { GridEngine } from "grid-engine";
import Character from "../Character";
import { Land } from "../farm/Land";
import { HoeTool } from "./HoeTool";

export class ToolManager {
    private map: Tilemaps.Tilemap;
    private hoeTool: Tool;
    private currentTool: Tool | null;
    private currentToolType: ToolType;
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
    }
    public onPointerMove(worldPoint: object | Phaser.Math.Vector2) {
        if(this.currentTool) {
            const pointerTileX = this.map.worldToTileX(worldPoint.x) || 0;
            const pointerTileY = this.map.worldToTileY(worldPoint.y) || 0;
            this.currentTool.onPointerMove(pointerTileX, pointerTileY);
        }
    }

    public onPointerUp(worldPoint: object | Phaser.Math.Vector2) {
        if(this.currentTool) {
            const pointerTileX = this.map.worldToTileX(worldPoint.x) || 0;
            const pointerTileY = this.map.worldToTileY(worldPoint.y) || 0;
            this.currentTool.onPointerUp(pointerTileX, pointerTileY);
        }
    }

    public hasActiveTool() {
        return this.currentTool ? true : false;
    }

    public setActiveTool(selectedToolType: ToolType) {

        if(this.currentToolType && this.currentToolType === selectedToolType) {
            selectedToolType = ToolType.NONE;
        }
        
        switch (selectedToolType) {
            case ToolType.HOE:
                this.currentTool = this.hoeTool;
                this.currentToolType = ToolType.HOE;
                break;
            default:
                this.currentTool = null;
                this.currentToolType = ToolType.NONE;
                this.marker.setAlpha(0);
        }
        if(this.currentToolType) {
            this.marker.setAlpha(1);
        }
    }
}
