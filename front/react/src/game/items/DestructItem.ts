import { GenericItem } from "./GenericItem";


export class DestructItem {
    private resources: Array<GenericItem> = [];
    private destructionResult : (resources : Array<GenericItem>) => Array<GenericItem>;

    // public static clone(orig: DestructItem) {
    //     return new DestructItem()
    // }

    public setDestructionResult(func: (resources: Array<GenericItem>) => Array<GenericItem>) {
        this.destructionResult = func;
    }

    public getResources() {
        return this.destructionResult(this.resources);
    }

    public addResource(resource: GenericItem) {
        this.resources.push(resource);
    }
}
