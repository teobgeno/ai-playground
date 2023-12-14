import {Action} from './Action'
export class Task {
    private actions: Array<Action>;
    private actionPointer: number;

    constructor() {
        this.actions = [];
        this.actionPointer = 0;
    }

    public addAction(action:Action) {
        this.actions.push(action);
    }
}
