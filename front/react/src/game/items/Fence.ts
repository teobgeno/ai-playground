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
    TextureData,
} from "../core/types";
import { Cursor } from "../cursors/types";
import { Utils } from "../core/Utils";
export class Fence extends BaseItem implements MapObject {
    private mapManager: MapManager;
    public destruct: DestructItem;
    public sprites: Array<SpriteItem> = [];
    public activeCursor: Cursor | null;
    private isDoor: boolean;
    private isDoorOpen: boolean = false;

    constructor(
        scene: Phaser.Scene,
        mapManager: MapManager,
        coords: CoordsData,
        texture: TextureData,
        padX: number,
        padY: number
    ) {
        super(Utils.generateId(), ObjectId.Fence, "Fence Part");
        this.mapManager = mapManager;
        this.sprites.push(new SpriteItem(
            scene,
            { texture: texture.texture, frame: texture.frame },
            {
                x: coords.x,
                y: coords.y,
                pixelX: coords.pixelX,
                pixelY: coords.pixelY,
            },
            padX,
            padY
        ));
        this.sprites[0].setDepth(2);
        this.destruct = new DestructItem();
        this.isDoor = true;

        this.addSriteListeners();
        this.toggleCollisions(true);
        this.addMapObject();
    }

    public setResource(resource: GenericItem) {
        this.destruct.addResource(resource);
    }

    private toggleCollisions(collide: boolean) {
        this.mapManager.setTileCollition(
            this.sprites[0].getX(),
            this.sprites[0].getY(),
            collide
        );
    }
    
    private addSriteListeners() {
        this.sprites[0].getSprite().setInteractive({
            cursor: "cursor",
        });
        this.sprites[0]
            .getSprite()
            .on("pointerover", () => this.toggleCursorExecution(true));
        this.sprites[0]
            .getSprite()
            .on("pointerout", () => this.toggleCursorExecution(false));
        this.sprites[0]
            .getSprite()
            .on("pointerdown", (pointer:Phaser.Input.Pointer) => this.interactDoor(pointer));
    }
    private interactDoor(pointer:Phaser.Input.Pointer) {
        if(pointer.rightButtonDown()) {
            this.isDoorOpen = this.isDoorOpen ? false : true;
            this.sprites[0].setAlpha(this.isDoorOpen ? 0.4 : 1);
            this.toggleCollisions(!this.isDoorOpen);
        }
    }
    private addMapObject() {
        this.mapManager.setPlotLandCoords(
            this.sprites[0].getX(),
            this.sprites[0].getY(),
            this
        );
    }

    private removeMapObject() {
        this.mapManager.setPlotLandCoords(
            this.sprites[0].getX(),
            this.sprites[0].getY(),
            null
        );
    }

    public setExternalActiveCursor(cursor: Cursor | null) {
        this.activeCursor = cursor;
    }

    private toggleCursorExecution = (canExecute: boolean) => {
        if (
            this.activeCursor &&
            typeof this.activeCursor?.getItem !== "undefined" &&
            this.activeCursor?.getItem().objectId === ObjectId.PickAxe
        ) {
            if (typeof this.activeCursor?.setCanExecute !== "undefined") {
                this.activeCursor?.setCanExecute(canExecute);
            }
        }
    };

    public interactWithItem() {
        //item (axe), character -> addInventory
        this.sprites[0].setAlpha(0);
        this.toggleCollisions(false);
        this.removeMapObject();
        this.sprites[0].destroy();
    }

    public getDestruct() {
        return this.destruct.getResources((resources) => {
            for (const resource of resources) {
                const rand =  Math.floor(Math.random() * (6 - 1) + 1);
                resource.getInventory().setAmount(rand);
            }
            return resources;
        });
    }

    public getSprite() {
        return this.sprites[0];
    }
}
