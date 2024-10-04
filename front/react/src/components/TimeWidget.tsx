import { useEffect, useState } from "react";
import { ServiceLocator } from "../game/core/serviceLocator";
import { TimeManager } from "../game/TimeManager";
import { Utils } from "../game/core/Utils";
import "./TimeWidget.css";

export function TimeWidget() {

    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            
            const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager');
            //const curTime = timeManager?.getCurrentTimestamp();
            if(timeManager) {
                setDate(new Date(timeManager.getCurrentTimestamp()));
            }
            
        }, 100);
      
        //Clearing the interval
        return () => clearInterval(interval);
    });

    return (
        <>
            <div>
                {Utils.zeroPad(date.getUTCDate(), 2) + '-' + Utils.zeroPad(date.getUTCMonth() + 1, 2) + '-' + date.getUTCFullYear()}<br/>
                {Utils.zeroPad(date.getUTCHours(), 2) + ':' + Utils.zeroPad(date.getUTCMinutes(), 2) + ':' + Utils.zeroPad(date.getUTCSeconds(), 2)}
            </div>
        </>
    );
}
