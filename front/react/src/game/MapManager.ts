import { Tilemaps } from "phaser";
import { LandProperties } from "./farm/types";
import { FarmLand } from "./farm/FarmLand";

export class MapManager {
    private map: Tilemaps.Tilemap;
    private plotLandCoords: Map<string, LandProperties> = new Map();
    private plotLandEntities: Array<FarmLand> = [];
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

    public setPlotLandCoords(key:string, entity: LandProperties) {
        this.plotLandCoords.set(key, entity);
    }

    public updatePlotLandCoords(key:string, entity: LandProperties) {
        const current = this.plotLandCoords.get(key);
        this.plotLandCoords.set(key, {...current, ...entity});
    }

    public getPlotLandEntities() {
        return this.plotLandEntities;
    }

    public addPlotLandEntity(entity: FarmLand) {
        this.plotLandEntities.push(entity);
    }

    public deletePlotLandEntityByCoords(x:number, y:number) {
        const landIndex = this.plotLandEntities.findIndex(e=> e.getPixelX() === x && e.getPixelY() === y);
        this.plotLandEntities.splice(landIndex, 1);
    }

    public isTilePlotExist(x: number, y: number) {
        const land = this.plotLandCoords.get(x + "-" + y);
        return land ? true: false;
    }

    public hasTilePlotConstruction(x: number, y: number) {
        const land = this.plotLandCoords.get(x + "-" + y);
        return land?.hasFence
    }

    public isTilePlotOccupied(x: number, y: number) {
        const land = this.plotLandCoords.get(x + "-" + y);
        return land?.hasFence || land?.isWeeded;
    }
}
