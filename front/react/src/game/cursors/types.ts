import { Storable } from "../items/types"

export enum CursorType {
    NONE = 0,
    HOE = 1,
    CROP = 2,
    PLACE_ITEM = 3,
    FENCE = 4,
    EXTERNAL_INTERACTION = 5,
   
}

export interface Cursor {
    onPointerMove(pointerTileX: number, pointerTileY: number): void;
    onPointerUp(pointerTileX: number, pointerTileY: number): void;
    onPointerDown?:(pointerTileX: number, pointerTileY: number) => void;
    setCanExecute?: (canExecute: boolean) => void;
    getItem?: () => Storable;
    hidePointer(): void;
}
