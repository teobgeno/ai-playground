export enum LandState {
    EMPTY = 0,
    PLOWED = 1,
    PLANTED = 2,
    READY = 3,
}

export interface LandElements {
    water: number;
    fertilizer: number;
}

export interface LandProperties {
    isWeeded?: boolean;
    hasCrop?: boolean;
    hasConstruction?: boolean;
    hasFence?: boolean;
}
