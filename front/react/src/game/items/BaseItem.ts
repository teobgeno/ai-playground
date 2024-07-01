
import { ObjectId } from "../core/types";
export class BaseItem {
    public id: number;
    public objectId: ObjectId;
    public title: string;

    constructor(id: number, objectId: ObjectId, title: string) {
        this.id = id;
        this.objectId = objectId;
        this.title = title;
       
    }
}
