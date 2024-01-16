'use client'

import { BusRouteEstType } from "@/type/BusRouteEstType";

export const RemainningTime = ({remainingTimeData}:
    {remainingTimeData:BusRouteEstType}) => {
    if (remainingTimeData.StopStatus === 1 && remainingTimeData.NextBusTime) {
        const t = new Date(remainingTimeData.NextBusTime)
        const hours = String(t.getHours()).padStart(2, '0');
        const minutes = String(t.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        return <span className=" border-2 border-slate-300 p-1 w-20 rounded h-fit text-center">{formattedTime}</span>
    } 
    if (remainingTimeData.StopStatus === 0 && typeof remainingTimeData.EstimateTime === "number") {
        const estTime = (Math.ceil(Number(remainingTimeData?.EstimateTime))/60-1)
        if (estTime <= 0) {
            return <span className="bg-red-500 w-20 text-center text-white p-1  rounded h-fit ">進站中</span>
        }
        if (estTime <= 3) {
            return <span className="bg-red-100 w-20 text-center text-red-800 p-1  rounded h-fit ">{`${estTime} 分鐘`}</span>
        }
        return <span className="p-1  rounded w-20 text-center h-fit bg-white">{`${estTime} 分鐘`}</span>
    }
    return <span className="w-20 text-center">末班駛離</span>
}