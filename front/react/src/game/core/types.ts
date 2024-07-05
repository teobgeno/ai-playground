import { SpriteItem } from "../items/SpriteItem";
import { Cursor } from "../cursors/types";
import { GenericItem } from "../items/GenericItem";
import { InteractiveItem } from "../items/InteractiveItem";
import { DestructItem } from "../items/DestructItem";

export interface SceneProps {
    map?: string;
}

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


// export enum ObjectType {
//     Stone = 1,
//     Wood = 2,
//     FencePart = 3,
//     Rock = 4,
//     PickAxe = 5,
//     Hoe = 6,
//     Corn = 7,
//     CornSeeds = 8,
//     Seed = 9,
//     Tree = 10,
//     Fence = 11,
//     Tool = 12,
// }

export enum ObjectId {
    None = 0,
    Hoe = 1,
    PickAxe = 2,
    FarmLand = 3,
    Rock = 4,
    Tree = 5,
    Seed = 6,
    Fence = 7,
    Wood = 8,
    Stone = 9,
    Corn = 10,
    CornSeed = 11,
    Lake = 12,
    WaterCan = 13
}

export interface MapObject {
    id: number;
    objectId: ObjectId;
    sprites: Array<SpriteItem>;
    update?: (time: number) => void;
    getDestruct?: () => DestructItem
    getInteractive?: () => InteractiveItem
}

export interface MapObjectDestructable {
    getDestruct: () => DestructItem
}
export interface MapObjectInteractable {
    getInteractive: () => InteractiveItem
}
