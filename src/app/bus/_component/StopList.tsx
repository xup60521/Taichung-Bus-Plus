'use client'

import type { BusRouteType } from "@/type/BusRouteType";
import { FaArrowRightLong } from "react-icons/fa6";

export default function StopList({routeDetail, direction, bus}: {routeDetail: BusRouteType, direction: number, bus:string}) {
    if (!Array.isArray(routeDetail.data)) {
        return ""
    }

    
    const isOneWay = (routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    let filteredData;
    if (isOneWay) {
        filteredData = routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus)[0].Stops
    } else {
        filteredData = routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus && item.Direction === direction)[0].Stops.sort((a, b)=>a.StopSequence - b.StopSequence)
    }
    
    

    return (
        <>
            <div className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 font-bold border-2 rounded-md p-2 w-full">
                <span className="w-2/5 text-center">{filteredData[0].StopName.Zh_tw}</span>
                <span className="w-1/5 flex justify-center "><FaArrowRightLong /></span>
                <span className="w-2/5 text-center">{filteredData.reverse()[0].StopName.Zh_tw}</span>
            </div>
            <div className=" flex-grow w-full overflow-y-auto flex flex-col gap-2">
                {filteredData.reverse().map(d=>{
                    return (
                        <div key={d.StopName.Zh_tw}>
                            <span className="text-xl">{d.StopName.Zh_tw}</span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}