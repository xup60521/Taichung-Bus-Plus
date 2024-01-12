'use client'

import type { BusRouteType } from "@/type/BusRouteType";
import DisplayMarker from "./DisplayMarker";
import seedrandom from "seedrandom";

export default function StopsMarker({routeDetail, direction, bus}: {routeDetail: BusRouteType[] | undefined | null, direction: number, bus:string}) {
    if (!Array.isArray(routeDetail) || routeDetail.length === 0) {
        return ""
    }
    const isOneWay = (routeDetail.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    let filteredData;
    if (isOneWay) {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus)[0].Stops
    } else {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus && item.Direction === direction)[0]?.Stops
    }


    const bg_color = `rgb(${Math.floor(255*seedrandom(`${bus} R`)())},${Math.floor(255*seedrandom(`${bus} G`)())},${Math.floor(255*seedrandom(`${bus} B`)())})`

    return (
        <>
            {filteredData?.reverse().map((d)=>{
                return <DisplayMarker bg_color={bg_color} key={d.StopSequence.toString()} d={d} />
            })}
        </>
    )
}
