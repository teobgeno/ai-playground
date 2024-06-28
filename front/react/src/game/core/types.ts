import { SpriteItem } from "../items/SpriteItem";
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

export enum MapObjectType {
    FarmLand = 1,
    Rock = 2,
    Fence = 3,
}

export enum ObjectItems {
    Stone = 1,
    Wood = 2,
    FencePart = 3,
    Rock = 4
}

export interface MapObject {
    objectType: MapObjectType;
    sprite: SpriteItem;
}
