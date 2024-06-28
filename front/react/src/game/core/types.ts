import { SpriteItem } from "../items/SpriteItem";
export interface CoordsData {
    x: number;
    y: number;
    pixelX: number;
    pixelY: number;
}

export interface TextureData {
    texture: string;
    frame: number;
}

export enum MapObjectType {
    FarmLand = 1,
    Rock = 2,
}

export interface MapObject {
    objectType: MapObjectType;
    sprite: SpriteItem;
}
