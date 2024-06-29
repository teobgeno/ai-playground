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

export class Rock extends BaseItem implements MapObject {
    public objectType: MapObjectType = MapObjectType.Rock;
    public destruct: DestructItem;
    public sprites: Array<SpriteItem> = [];
    public activeCursor: Cursor | null;

    constructor(scene: Phaser.Scene, coords: CoordsData) {
        super(ObjectItems.Rock, "Rock");
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
            new GenericItem(ObjectItems.Stone, "stone", new InventoryItem())
        );

        this.sprites[0].getSprite().setInteractive({
            cursor: "cursor",
        });
        this.sprites[0].getSprite().on("pointerover", () => this.toggleCursorExecution(true));
        this.sprites[0].getSprite().on("pointerout",  () => this.toggleCursorExecution(false));
    }

    // public static clone(orig: GenericItem) {
    //     return new GenericItem(
    //         orig.id,
    //         orig.title,
    //         InventoryItem.clone(orig.getInventory())
    //     )
    // }
    public setExternalActiveCursor(cursor: Cursor | null) {
        this.activeCursor = cursor;
    }

    private toggleCursorExecution = (canExecute: boolean) => {
        if(this.activeCursor && typeof this.activeCursor?.getItem !== "undefined" && this.activeCursor?.getItem().id === ObjectItems.PickAxe) {
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
