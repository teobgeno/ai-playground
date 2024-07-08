import { Cursor } from "../cursors/types";
import { SpriteItem } from "./SpriteItem";
import { ObjectId } from "../core/types";
import { Storable } from "./types";

export class InteractiveItem {
    private sprite: SpriteItem;
    private activeCursor: Cursor | null;
    private interactiveObjectIds: Array<ObjectId>;
    private selectedObject: Storable | null;
    private interactionResult: (selectedObject: Storable | null) => void;

    public startInteraction() {
        this.addSpriteListeners();
    }

    public setSprites(sprite: SpriteItem) {
        this.sprite = sprite;
    }

    public setInteractionResult(
        func: (selectedObject: Storable | null) => void
    ) {
        this.interactionResult = func;
    }

    public setInteractiveObjectIds(interactiveObjectIds: Array<ObjectId>) {
        this.interactiveObjectIds = interactiveObjectIds;
    }

    public setExternalActiveCursor(cursor: Cursor | null) {
        this.activeCursor = cursor;
        this.activeCursor && this.activeCursor.getItem
            ? this.setIntercativeObject(this.activeCursor?.getItem())
            : this.setIntercativeObject(null);
    }

    public setIntercativeObject(object: Storable | null) {
        this.selectedObject = object;
    }

    private addSpriteListeners() {
        this.sprite.getSprite().setInteractive({
            cursor: "cursor",
        });
        this.sprite
            .getSprite()
            .on("pointerover", () => this.toggleCursorExecution(true));
        this.sprite
            .getSprite()
            .on("pointerout", () => this.toggleCursorExecution(false));
        this.sprite.getSprite().on("pointerup", () => {
            if (!this.activeCursor) {
                this.interactWithItem();
            }
        });
    }

    private toggleCursorExecution = (canExecute: boolean) => {
        if (
            this.activeCursor &&
            typeof this.activeCursor?.getItem !== "undefined" &&
            this.interactiveObjectIds.includes(
                this.activeCursor?.getItem().objectId
            )
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
