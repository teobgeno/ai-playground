export class Utils {
    static idCounter = 1000;
    
    static generateId() { return this.idCounter ++; }

    static shiftPad(t:number, e:number) {
        const i = Math.floor(t),
            o = `${i}`.padStart(e, "0").length;
        return i / Math.pow(10, o)
    }

    static getTimeStamp() {
        return  Math.round(new Date().getTime() / 1000);
    }

    static zeroPad (num:number, places: number) { 
        return String(num).padStart(places, '0');
    }
}