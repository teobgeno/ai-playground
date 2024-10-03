import { useEffect, useState } from "react";
import { ServiceLocator } from "../game/core/serviceLocator";
import { TimeManager } from "../game/TimeManager";
import "./TimeWidget.css";

export function TimeWidget() {

    const [date, setDate] = useState(new Date());
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    useEffect(() => {
        const interval = setInterval(() => {
            
            const timeManager = ServiceLocator.getInstance<TimeManager>('timeManager');
            //const curTime = timeManager?.getCurrentTimestamp();
            if(timeManager) {
                setDate(new Date(timeManager.getCurrentTimestamp()));
            }
            
        }, 1000);
      

        //Clearing the interval
        return () => clearInterval(interval);
    });

    return (
        <>
            <div>
                {zeroPad(date.getDate(), 2) + '-' + zeroPad(date.getMonth(), 2) + '-' + date.getUTCFullYear()}<br/>
                {zeroPad(date.getUTCHours(), 2) + ':' + zeroPad(date.getMinutes(), 2)}
            </div>
        </>
    );
}
