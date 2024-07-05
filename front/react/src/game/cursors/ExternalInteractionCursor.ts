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
    private activeMarker: Phaser.GameObjects.Sprite;

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
        this.activeMarker =  this.scene.add
        .sprite(-1000, -1000, "cur")
        .setDepth(8);
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

        this.activeMarker.x = -1000;
        this.activeMarker.y = -1000;
        this.activeMarker.setAlpha(0);
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.marker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.marker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        this.marker.setAlpha(1);

        this.activeMarker.setAlpha(0.4);
        this.activeMarker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.activeMarker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;

        //const mapObj = this.mapManager.getPlotLandCoord(pointerTileX, pointerTileY);

        if (this.canExecute) {
            this.activeMarker.setAlpha(1);
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
                if (typeof landItem?.getInteractive !== "undefined") {
                    landItem?.getInteractive().interactWithItem();
                }
                if (typeof landItem?.getDestruct !== "undefined") {
                    console.log(landItem?.getDestruct());
                    const resources = landItem?.getDestruct().getResources();
                    for (const resource of resources) {
                        this.character.getInventory().addItem(resource);
                    }
                }
            }
        }
    }
}
