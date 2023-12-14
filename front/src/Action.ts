export class Action {
    private funcExec: Function
    private funcParams: any

    constructor(func: Function,params : any) {
        this.funcExec = (params) => {
            func(params)
        };
        this.funcParams = params;
    }
    
    public execute(){
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        //return this.execFunc();
    }
}
