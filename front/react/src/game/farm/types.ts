export enum LandState {
    EMPTY,
    PLOWED,
    PLANTED,
    READY,
}

export interface LandElements {
    water: number;
    fertilizer: number;
}

export interface LandEntity {
    isWeeded: boolean;
    hasCrop: boolean;
}

export enum CropType {
    TOMATO = 1,
    CORN = 2,
}

