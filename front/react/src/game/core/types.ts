import { SpriteItem } from "../items/SpriteItem";
import { Cursor } from "../cursors/types";
export interface CoordsData {
    x: number;
    y: number;
    pixelX: number;
    pixelY: number;
}

export interface TextureData {
    texture: string;
    frame: number | string;
}


export enum ObjectType {
    Stone = 1,
    Wood = 2,
    FencePart = 3,
    Rock = 4,
    PickAxe = 5,
    Hoe = 6,
    Corn = 7,
    CornSeeds = 8,
    Seed = 9,
    Tree = 10,
    Fence = 11,
}

export enum ObjectId {
    Corn = 1,
    CornSeeds = 2,
    Wood = 3,
    Hoe = 4
}

export interface MapObject {
    id: number;
    objectType: ObjectType;
    sprites: Array<SpriteItem>;
    update?: (time: number) => void
    setExternalActiveCursor?: (cursor: Cursor | null) => void
    interactWithItem?: () => void
}
