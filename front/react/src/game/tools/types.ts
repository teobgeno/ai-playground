export enum CursorType {
    NONE = 0,
    HOE = 1,
    CROP = 2,
    WATERING_CAN = 3,
   
}

export interface Cursor {
    onPointerMove(pointerTileX: number, pointerTileY: number): void;
    onPointerUp(pointerTileX: number, pointerTileY: number): void;
}
