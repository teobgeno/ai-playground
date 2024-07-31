export enum StorageSections  {
    INVENTORY = 'inventory',
}

export enum StorageSubSections  {
    ITEMS = 'items',
    CRAFTINGRIDIENTS = 'craftIngridients',
}

export type MoveStorableProps = {
    sourceSection : StorageSections;
    sourceSubSection : StorageSubSections
    sourceId : number
    targetSection : StorageSections;
    targetSubSection : StorageSubSections
    targetKey : number
}