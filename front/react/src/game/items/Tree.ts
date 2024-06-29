import { MapManager } from "../MapManager";
import { BaseItem } from "./BaseItem";
import { InventoryItem } from "./InventoryItem";
import { DestructItem } from "./DestructItem";
import { SpriteItem } from "./SpriteItem";
import { GenericItem } from "./GenericItem";
import {
    CoordsData,
    MapObject,
    MapObjectType,
    ObjectItems,
} from "../core/types";
import { Cursor } from "../cursors/types";

export class Tree extends BaseItem implements MapObject {
    private mapManager: MapManager;
    public objectType: MapObjectType = MapObjectType.Tree;
    public destruct: DestructItem;
    public sprites: Array<SpriteItem> = [];
    public activeCursor: Cursor | null;

    constructor(
        scene: Phaser.Scene,
        mapManager: MapManager,
        coords: CoordsData
    ) {
        //TODO:: generate id ????
        super(ObjectItems.Rock, "Tree");
        this.mapManager = mapManager;
        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "map", frame: "tree_branch" },
                {
                    x: coords.x,
                    y: coords.y,
                    pixelX: coords.pixelX,
                    pixelY: coords.pixelY,
                },
                16,
                16
            )
        );
        this.sprites[0].setDepth(1);

        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "map", frame: "tree_top" },
                {
                    x: coords.x,
                    y: coords.y,
                    pixelX: coords.pixelX,
                    pixelY: coords.pixelY - 77,
                },
                16,
                16
            )
        );
        this.sprites[1].setDepth(3);

        this.destruct = new DestructItem();
        this.destruct.addResource(
            new GenericItem(ObjectItems.Stone, "stone", new InventoryItem())
        );

        this.addSriteListeners();
        this.addCollisions();
    }

    private addCollisions() {

        this.mapManager.setTileCollition(
            this.sprites[0].getX(),
            this.sprites[0].getY(),
            true
        );
        this.mapManager.setTileCollition(
            this.sprites[0].getX() - 1,
            this.sprites[0].getY(),
            true
        );
        this.mapManager.setTileCollition(
            this.sprites[0].getX() + 1,
            this.sprites[0].getY(),
            true
        );
        this.mapManager.setTileCollition(
            this.sprites[0].getX(),
            this.sprites[0].getY() - 1,
            true
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
    }

    public setExternalActiveCursor(cursor: Cursor | null) {
        this.activeCursor = cursor;
    }

    private toggleCursorExecution = (canExecute: boolean) => {
        if (
            this.activeCursor &&
            typeof this.activeCursor?.getItem !== "undefined" &&
            this.activeCursor?.getItem().id === ObjectItems.PickAxe
        ) {
            if (typeof this.activeCursor?.setCanExecute !== "undefined") {
                this.activeCursor?.setCanExecute(canExecute);
            }
        }
    };

    public interactWithItem() {
        //item (axe), character -> addInventory
        console.log("destruct tree");
    }

    public getDestruct() {
        return this.destruct;
    }

    public getSprite() {
        //return this.sprite;
    }
}
