import { Tilemaps } from "phaser";
import { LandEntity } from "./farm/types";
import { Land } from "./farm/Land";
export class MapManager {
    private map: Tilemaps.Tilemap;
    private plotLandCoords: Map<string, LandEntity>;
    private plotLandEntities: Array<Land> = [];
    constructor(map: Tilemaps.Tilemap) {
        this.map = map;
    }

    public createPlotLandCoords() {
        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tileGround = this.map.getTileAt(x, y, false, "Ground");

                const tileTree = this.map.getTileAt(x, y, false, "Trees");

                if (tileGround && !tileTree) {
                    this.plotLandCoords.set(x + "-" + y, {
                        isWeeded: false,
                        hasCrop: false,
                        hasConstruction: false,
                    });
                }
            }
        }
    }

    public getPlotLandCoords() {
        return this.plotLandCoords;
    }

    public setPlotLandCoords(key:string, entity: LandEntity) {
        this.plotLandCoords.set(key, entity);
    }

    public updatePlotLandCoords(key:string, entity: LandEntity) {
        this.plotLandCoords.set(key, entity);
    }

    public getPlotLandEntities() {
        return this.plotLandEntities;
    }

    public addPlotLandEntity(entity: Land) {
        this.plotLandEntities.push(entity);
    }

    public deletePlotLandEntity(entity: Land) {
        this.plotLandEntities.push(entity);
    }
}
