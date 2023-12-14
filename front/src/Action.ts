export class Action {
    private execFunc: Function

    constructor(func: Function) {
        this.execFunc = (params) => {
            func(params)
        };
    }
    
    public execute(){
        return this.execFunc();
    }
}
