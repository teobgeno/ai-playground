import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

import { Hoe } from "../items/Hoe";
import { TillageTask } from "../actions/TillageTask";
import { FarmLand } from "../farm/FarmLand";

import { Storable } from "../items/types";
import { Humanoid } from "../characters/Humanoid";
import { Cursor } from "./types";

export class ExternalInteractionCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private marker: Phaser.GameObjects.Rectangle;
    private canExecute: boolean = false;
    private tool: Storable;

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

    public setItem(tool: Storable) {
        this.tool = tool;
    }

    public getItem() {
        return this.tool;
    }

    public setCanExecute(canExecute: boolean) {
        this.canExecute = canExecute;
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

        //const mapObj = this.mapManager.getPlotLandCoord(pointerTileX, pointerTileY);

        if (this.canExecute) {
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
                if (typeof landItem?.interactWithItem !== "undefined") {
                    landItem?.interactWithItem();
                }
            }
        }
    }
}
