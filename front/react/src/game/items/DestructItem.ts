import { GenericItem } from "./GenericItem";

export class DestructItem  {

    public isStackable: boolean = true;
    public amount: number = 0;
    public icon: string = '';

    private resources: Array<GenericItem> = [];


    // public static clone(orig: DestructItem) {
    //     return new DestructItem()
    // }

    public getResources(func: (resources: Array<GenericItem>)=> number){
        return func(this.resources)
    }

}
