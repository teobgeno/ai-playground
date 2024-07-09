import { Cursor } from "../cursors/types";
import { SpriteItem } from "./SpriteItem";
import { ObjectId } from "../core/types";
import { Storable } from "./types";

export class InteractiveItem {
    private scene: Phaser.Scene;
    private sprite: SpriteItem;
    private activeCursor: Cursor | null;
    private interactiveObjectIds: Array<ObjectId>;
    private selectedObject: Storable | null;
    private hasSelfInteraction: boolean = false;
    private selfInteractionCursor: string = 'assets/cursors/axe.cur';
    private interactionResult: (selectedObject: Storable | null) => void;

    public startInteraction() {
        this.addSpriteListeners();
    }

    public setScene(scene: Phaser.Scene) {
        this.scene = scene;
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

    public setSelfInteraction(hasSelfInteraction: boolean) {
        this.hasSelfInteraction = hasSelfInteraction;
        if(!hasSelfInteraction) {
            this.scene.input.setDefaultCursor('pointer');
        }
    }
    public setSelfInteractionCursor(selfInteractionCursor: string) {
        this.selfInteractionCursor = selfInteractionCursor;
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
        this.sprite.getSprite().on("pointerover", this.onPointerOver);
        this.sprite.getSprite().on("pointerout", this.onPointerOut);
        this.sprite.getSprite().on("pointerup", this.onPointerUp);
    }

    private onPointerOver = () =>  { 
        if (this.activeCursor) {
            this.toggleCursorExecution(true);
        }
        if (!this.activeCursor && this.hasSelfInteraction) {
            this.scene.input.setDefaultCursor('url(' + this.selfInteractionCursor + '), pointer');
            console.log('self over');
        }
    }

    private onPointerOut = () => {
        if (this.activeCursor) {
            this.toggleCursorExecution(false);
        }

        if (!this.activeCursor && this.hasSelfInteraction) {
            this.scene.input.setDefaultCursor('pointer');
            console.log('self out');
        }
    }

    private onPointerUp = () => {
        if (!this.activeCursor && this.hasSelfInteraction) {
            console.log('self click');
            this.interactWithItem();
        }
    }

    private toggleCursorExecution = (canExecute: boolean) => {
        if (
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

    public pauseInteraction() {
        this.sprite.getSprite().disableInteractive();
    }

    public resumeInteraction() {
        this.sprite.getSprite().setInteractive();
    }

    public destroyInteraction() {
        this.sprite.getSprite().removeInteractive();
        this.sprite.getSprite().off("pointerover", this.onPointerOver);
        this.sprite.getSprite().off("pointerout", this.onPointerOut);
        this.sprite.getSprite().off("pointerup", this.onPointerUp);
    }
}
