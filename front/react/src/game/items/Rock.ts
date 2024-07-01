import { MapManager } from "../MapManager";
import { BaseItem } from "./BaseItem";
import { InventoryItem } from "./InventoryItem";
import { DestructItem } from "./DestructItem";
import { SpriteItem } from "./SpriteItem";
import { GenericItem } from "./GenericItem";
import {
    CoordsData,
    MapObject,
    ObjectId,
} from "../core/types";
import { Cursor } from "../cursors/types";
import { Utils } from "../core/Utils";

export class Rock extends BaseItem implements MapObject {
    private mapManager: MapManager;
    public destruct: DestructItem;
    public sprites: Array<SpriteItem> = [];
    public activeCursor: Cursor | null;

    constructor(scene: Phaser.Scene, mapManager: MapManager,coords: CoordsData) {
        super(Utils.generateId(), ObjectId.Rock, "Rock");
        this.mapManager = mapManager;
        this.sprites.push(new SpriteItem(
            scene,
            { texture: "map", frame: "rock" },
            {
                x: coords.x,
                y: coords.y,
                pixelX: coords.pixelX,
                pixelY: coords.pixelY,
            },
            16,
            16
        ));
        this.sprites[0].setDepth(1);
        this.destruct = new DestructItem();
        this.destruct.addResource(
            new GenericItem(ObjectId.Stone, "stone", new InventoryItem())
        );

        this.addSriteListeners();
        this.addCollisions();
        this.addMapObject();
    }

    private addCollisions() {

        this.mapManager.setTileCollition(
            this.sprites[0].getX(),
            this.sprites[0].getY(),
            true
        );
    }

    private addSriteListeners() {
        this.sprites[0].getSprite().setInteractive({
            cursor: "cursor",
        });
        this.sprites[0].getSprite().on("pointerover", () => this.toggleCursorExecution(true));
        this.sprites[0].getSprite().on("pointerout",  () => this.toggleCursorExecution(false));
    }

    private addMapObject() {
        this.mapManager.setPlotLandCoords(this.sprites[0].getX(), this.sprites[0].getY(), this);
    }

    public setExternalActiveCursor(cursor: Cursor | null) {
        this.activeCursor = cursor;
    }

    private toggleCursorExecution = (canExecute: boolean) => {
        if(this.activeCursor && typeof this.activeCursor?.getItem !== "undefined" && this.activeCursor?.getItem().objectId === ObjectId.PickAxe) {
           if(typeof this.activeCursor?.setCanExecute !== "undefined") {
            this.activeCursor?.setCanExecute(canExecute);
           }
        }
    };

    public interactWithItem() {
        //item (axe), character -> addInventory
        console.log('destruct stone')
    }

    public getDestruct() {
        return this.destruct;
    }

    public getSprite() {
        return this.sprites[0];
    }
}
