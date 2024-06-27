import { GenericItem } from "./GenericItem";

export class DestructItem {
    private resources: Array<GenericItem> = [];

    // public static clone(orig: DestructItem) {
    //     return new DestructItem()
    // }

    public getResources(func: (resources: Array<GenericItem>) => number) {
        return func(this.resources);
    }

    public addResource(resource: GenericItem) {
        this.resources.push(resource);
    }
}
