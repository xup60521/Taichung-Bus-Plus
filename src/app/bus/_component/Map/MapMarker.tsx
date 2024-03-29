'use client'

import { BusRouteType } from "@/type/BusRouteType"
import { Unpacked } from "@/type/TypeOperator"
import { useStationName } from "@/utils/BusContext"
import { Icon } from "leaflet"
import dynamic from "next/dynamic"
// import { Icon } from "leaflet"
import { Marker, Tooltip } from "react-leaflet"
import NoSSR from "react-no-ssr"

const MapMarker = ({d, bg_color, bus,headsign}:
    {d: Unpacked<BusRouteType["Stops"]>, bg_color:string, bus:string,headsign:string}) => {

    const station = useStationName()
        
    if (typeof window === "undefined") {
        return <div>browser window is not ready</div>
    }
    const icon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [35,35],
    })   
    const icon2 = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
        iconSize: [35, 35],
    })  
        
    return (
        <Marker position={[d.StopPosition.PositionLat, d.StopPosition.PositionLon]} icon={(d.StopName.Zh_tw===station ? icon2 : icon)} >
        <Tooltip>
            <div key={d.StopSequence.toString()+"infoElm"} className="">
                <p>{`${bus} ${headsign}`}</p>
                <p className="font-bold" >{`${d.StopSequence} ${d.StopName.Zh_tw}`}</p>
            </div>
        </Tooltip>
    </Marker>)
    
}

export default MapMarker