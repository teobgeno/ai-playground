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

export class Tree extends BaseItem implements MapObject {
    private mapManager: MapManager;
    public destruct: DestructItem;
    public sprites: Array<SpriteItem> = [];
    public activeCursor: Cursor | null;

    constructor(
        scene: Phaser.Scene,
        mapManager: MapManager,
        coords: CoordsData
    ) {
        //TODO:: generate id ????
        super(Utils.generateId(), ObjectId.Tree, "Tree");
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


        this.sprites.push(
            new SpriteItem(
                scene,
                { texture: "map", frame: "tree_cut" },
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
        this.sprites[2].setDepth(1);
        this.sprites[2].setAlpha(0);

        this.destruct = new DestructItem();
        
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
        this.mapManager.setTileCollition(
            this.sprites[0].getX() - 1,
            this.sprites[0].getY(),
            collide
        );
        this.mapManager.setTileCollition(
            this.sprites[0].getX() + 1,
            this.sprites[0].getY(),
            collide
        );
        this.mapManager.setTileCollition(
            this.sprites[0].getX(),
            this.sprites[0].getY() - 1,
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
    }

    private addMapObject() {

        this.mapManager.setPlotLandCoords(this.sprites[0].getX(), this.sprites[0].getY() - 1, this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() - 1, this.sprites[0].getY()-1, this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() + 1, this.sprites[0].getY()-1, this);

        this.mapManager.setPlotLandCoords(this.sprites[0].getX(), this.sprites[0].getY(), this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() - 1, this.sprites[0].getY(), this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() + 1, this.sprites[0].getY(), this);

        this.mapManager.setPlotLandCoords(this.sprites[0].getX(), this.sprites[0].getY() + 1, this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() - 1, this.sprites[0].getY() + 1, this);
        this.mapManager.setPlotLandCoords(this.sprites[0].getX() + 1, this.sprites[0].getY() + 1, this);
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
        console.log("destruct tree");
        this.sprites[0].setAlpha(0);
        this.sprites[1].setAlpha(0);
        this.sprites[2].setAlpha(1);
        this.toggleCollisions(false);
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
        //return this.sprite;
    }
}
