import { Tilemaps } from "phaser";
import { MapManager } from "../MapManager";
import { GridEngine } from "grid-engine";

// import { Hoe } from "../items/Hoe";
// import { TillageTask } from "../actions/TillageTask";
import { FarmLand } from "../farm/FarmLand";
import { Fence } from "../items/Fence";

// import { InventoryItem } from "../characters/types";
import { Humanoid } from "../characters/Humanoid";
import { Cursor } from "./types";
import { MapObjectType } from "../core/types";

export class FenceCursor implements Cursor {
    private scene: Phaser.Scene;
    private map: Tilemaps.Tilemap;
    private mapManager: MapManager;
    private gridEngine: GridEngine;
    private character: Humanoid;
    private markers: { [key: string]: Phaser.GameObjects.Sprite } = {};
    private activeMarker: Phaser.GameObjects.Sprite;
    private activeMarkerKey: string;
    private activeSprite: string;
    private canExecute: boolean = false;

    constructor(
        scene: Phaser.Scene,
        map: Tilemaps.Tilemap,
        mapManager: MapManager,
        gridEngine: GridEngine,
        character: Humanoid
    ) {
        this.scene = scene;
        this.map = map;
        this.mapManager = mapManager;
        this.gridEngine = gridEngine;
        this.character = character;

        this.markers["singlePole"] = this.scene.add
            .sprite(-1000, -1000, "fence", "pole")
            .setDepth(1.1);
        this.markers["oneRowRight"] = this.scene.add
            .sprite(-1000, -1000, "fence", "side_right")
            .setDepth(1.1);

        this.markers["oneRowLeft"] = this.scene.add
            .sprite(-1000, -1000, "fence", "side_left")
            .setDepth(1.1);

        this.markers["oneRowBoth"] = this.scene.add
            .sprite(-1000, -1000, "fence", "side_both")
            .setDepth(1.1);

        this.markers["oneColumnUp"] = this.scene.add
            .sprite(-1000, -1000, "fence", "column_up")
            .setDepth(1.1);

        this.markers["oneColumnDown"] = this.scene.add
            .sprite(-1000, -1000, "fence", "column_down")
            .setDepth(1.2);

        this.markers["oneColumnBoth"] = this.scene.add
            .sprite(-1000, -1000, "fence", "sprite4")
            .setDepth(1);

        this.activeMarker = this.markers["singlePole"];
    }

    // public setItem(hoe: InventoryItem) {
    //     this.hoe = hoe as Hoe;
    // }

    public hidePointer() {
        this.activeMarker.x = -1000;
        this.activeMarker.y = -1000;
        this.activeMarker.setAlpha(0);
    }

    public onPointerMove(pointerTileX: number, pointerTileY: number) {
        this.activeMarker.x = (this.map.tileToWorldX(pointerTileX) || 0) + 16;
        this.activeMarker.y = (this.map.tileToWorldY(pointerTileY) || 0) + 16;
        this.activeMarker.setAlpha(0);

        let hasFence = false;

        if (
            this.mapManager
                .getPlotLandCoords()
                .get(pointerTileX + "-" + pointerTileY)?.objectType === MapObjectType.Fence
        ) {
            hasFence = true;
        }

        this.activeMarkerKey = "singlePole";
        if (
            this.mapManager
                .getPlotLandCoords()
                .get(pointerTileX + "-" + (pointerTileY - 1))?.objectType === MapObjectType.Fence
        ) {
            this.activeMarkerKey = "oneColumnDown";
        }

        if (
            this.mapManager
                .getPlotLandCoords()
                .get(pointerTileX + "-" + (pointerTileY + 1))?.objectType === MapObjectType.Fence
        ) {
            this.activeMarkerKey = "oneColumnUp";
        }

        if (
            this.mapManager
                .getPlotLandCoords()
                .get(pointerTileX + "-" + (pointerTileY - 1))?.objectType === MapObjectType.Fence &&
            this.mapManager
                .getPlotLandCoords()
                .get(pointerTileX + "-" + (pointerTileY + 1))?.objectType === MapObjectType.Fence
        ) {
            this.activeMarkerKey = "oneColumnBoth";
        }

        if (
            this.mapManager
                .getPlotLandCoords()
                .get(pointerTileX - 1 + "-" + pointerTileY)?.objectType === MapObjectType.Fence
        ) {
            this.activeMarkerKey = "oneRowRight";
        }

        if (
            this.mapManager
                .getPlotLandCoords()
                .get(pointerTileX + 1 + "-" + pointerTileY)?.objectType === MapObjectType.Fence
        ) {
            this.activeMarkerKey = "oneRowLeft";
        }

        if (
            this.mapManager
                .getPlotLandCoords()
                .get(pointerTileX - 1 + "-" + pointerTileY)?.objectType === MapObjectType.Fence &&
            this.mapManager
                .getPlotLandCoords()
                .get(pointerTileX + 1 + "-" + pointerTileY)?.objectType === MapObjectType.Fence
        ) {
            this.activeMarkerKey = "oneRowBoth";
        }

        this.activeMarker = this.markers[this.activeMarkerKey];

        if (!hasFence) {
            this.activeMarker.setAlpha(0.4);
        }

        this.canExecute = false;
        if (
            this.mapManager.isTilePlotExist(pointerTileX, pointerTileY) &&
            this.mapManager.getPlotLandCoord(pointerTileX, pointerTileY) === null &&
            !this.gridEngine.isBlocked(
                { x: pointerTileX, y: pointerTileY },
                "CharLayer"
            )
        ) {
            this.canExecute = true;
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
                
                let padX = 16;
                let padY = 16;

                if (this.activeMarkerKey === "oneRowRight") {
                    padX = 7;
                }

                if (this.activeMarkerKey === "oneRowLeft") {
                    padX = 25;
                }

                if (this.activeMarkerKey === "oneColumnDown") {
                    padY = 0;
                }

                const landEntity = new FarmLand(
                    this.scene,
                    {x: tileGround.x, y: tileGround.y, pixelX: tileGround.pixelX, pixelY: tileGround.pixelY}
                );

                const fenceEntity = new Fence(
                    this.scene,
                    {x: tileGround.x, y: tileGround.y, pixelX: tileGround.pixelX, pixelY: tileGround.pixelY},
                    { texture: 'fence', frame: this.activeMarker.frame.customData.filename },
                    padX,
                    padY
                )
                this.mapManager.setPlotLandCoords( tileGround.x,  tileGround.y, fenceEntity);
                // this.scene.add
                //     .sprite(
                //         tileGround.pixelX + padX,
                //         tileGround.pixelY + padY,
                //         "fence",
                //         this.activeMarker.frame.customData.filename
                //     )
                //     .setDepth(2);

                tileGround.properties = { ge_collide: true };

                // const t = new TillageTask(
                //     this.mapManager,
                //     this.gridEngine,
                //     this.character,
                //     landEntity,
                //     this.hoe
                // );
                // this.character.addTask(t);
            }
        }
    }
}
