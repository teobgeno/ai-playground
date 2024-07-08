import { Cursor } from "../cursors/types";
import { SpriteItem } from "./SpriteItem";
import { ObjectId } from "../core/types";
import { Storable } from "./types";

export class InteractiveItem {

    private sprites: Array<SpriteItem> = [];
    private activeCursor: Cursor | null;
    private interactiveObjectIds: Array<ObjectId>;
    private selectedObject: Storable;
    private interactionResult : (selectedObject: Storable) => void;


    public startInteraction() {
        this.addSpriteListeners();
    }

    public setSprites(sprites: Array<SpriteItem>) {
        this.sprites = sprites;
    }

    public setInteractionResult(func: (selectedObject: Storable) => void) {
        this.interactionResult = func;
    }

    public setInteractiveObjectIds(interactiveObjectIds: Array<ObjectId>) {
        this.interactiveObjectIds = interactiveObjectIds;
    }

    public setExternalActiveCursor(cursor: Cursor | null) {
        this.activeCursor = cursor;
        if(this.activeCursor && this.activeCursor.getItem) {
            this.setIntercativeObject(this.activeCursor?.getItem());
        }
    }

    public setIntercativeObject(obeject : Storable) {
        this.selectedObject = obeject;
    }

    private addSpriteListeners() {
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

    private toggleCursorExecution = (canExecute: boolean) => {
        if (
            this.activeCursor &&
            typeof this.activeCursor?.getItem !== "undefined" &&
            this.interactiveObjectIds.includes(this.activeCursor?.getItem().objectId)
        ) {
            if (typeof this.activeCursor?.setCanExecute !== "undefined") {
                this.activeCursor?.setCanExecute(canExecute);
            }
        }
    };

    public interactWithItem() {
        this.interactionResult(this.selectedObject);
    }
}
