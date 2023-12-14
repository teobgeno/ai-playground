export class Action {
    private execFunc: Function

    constructor(execFunc: Function) {
        this.execFunc = execFunc;
    }
    
    public execute(){
        return this.execFunc();
    }
}
