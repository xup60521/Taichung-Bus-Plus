'use client'

import { useBus, useDirection, useRouteDetail, useStayOnRouteDetails } from "@/utils/BusContext"
import seedrandom from "seedrandom"
import MapMarker from "./MapMarker"
import NoSSR from "react-no-ssr"

export default function DisplayMarkers() {
    const routeDetail = useRouteDetail()
    const direction = useDirection()
    const bus = useBus()
    const stayOnRouteDetails = useStayOnRouteDetails()
    if (!Array.isArray(routeDetail) || routeDetail.length === 0) {
        return ""
    }

    const isOneWay = (routeDetail.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    let filteredData;
    if (isOneWay) {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus)[0].Stops
    } else {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw.toUpperCase() === bus.toUpperCase() && item.Direction === direction)[0]?.Stops
    }
    let headsign = ""
    if (filteredData) {
        headsign = `${filteredData[0].StopName.Zh_tw} - ${filteredData.reverse()[0].StopName.Zh_tw}`
    }

    const bg_color = `rgb(${Math.floor(255*seedrandom(`${bus} ${direction} R`)())},${Math.floor(255*seedrandom(`${bus} ${direction} G`)())},${Math.floor(255*seedrandom(`${bus} ${direction} B`)())})`

    if (typeof window === "undefined") {
        return <div>browser window is not ready</div>
    }

    return (
        <NoSSR>
            {(()=>{
                if (!stayOnRouteDetails.map(d=>d.RouteName.Zh_tw).includes(bus) || !stayOnRouteDetails.map(d=>d.Direction).includes(direction)) {
                    return filteredData?.reverse().map((d)=>{
                        if (typeof window !== "undefined") {
                            return <MapMarker headsign={headsign} bus={bus} bg_color={bg_color} key={d.StopSequence.toString()} d={d} />
                        }
                    })
                } else {return ""}
            })()}
            {stayOnRouteDetails?.map(d=>{
                const sign = `${d.Stops[0].StopName.Zh_tw} - ${d.Stops.reverse()[0].StopName.Zh_tw}`
                const color = `rgb(${Math.floor(255*seedrandom(`${d.RouteName.Zh_tw} ${d.Direction} R`)())},${Math.floor(255*seedrandom(`${d.RouteName.Zh_tw} ${d.Direction} G`)())},${Math.floor(255*seedrandom(`${d.RouteName.Zh_tw} ${d.Direction} B`)())})`
                return d.Stops.map(item=>{
                    if (typeof window !== "undefined") {
                        return <MapMarker headsign={sign} bus={d.RouteName.Zh_tw} bg_color={color} key={`${d.RouteName.Zh_tw} ${d.Direction} ${item.StopSequence}`} d={item} />

                    }
                })
            })}
        </NoSSR>
    )
}

