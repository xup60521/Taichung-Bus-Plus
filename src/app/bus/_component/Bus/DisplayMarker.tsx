'use client'

import type { BusRouteType } from "@/type/BusRouteType";
import type { Unpacked } from "@/type/TypeOperator";
import { useToggleShowStopInfo } from "@/utils/BusContext";
import { InfoWindow,  AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export default function DisplayMarker({d, bg_color, bus,headsign}:
    {d: Unpacked<BusRouteType["Stops"]>, bg_color:string, bus:string,headsign:string}) {
    
    const [open, setOpen] = useState(false)    
    const toggleShowStopInfo = useToggleShowStopInfo()
    useEffect(()=>{
        if (d.StopName.Zh_tw === toggleShowStopInfo.stopName) {
            setOpen(prev => !prev)
        }
    },[toggleShowStopInfo])

    return (
        <>
            <AdvancedMarker position={{lat: d.StopPosition.PositionLat, lng: d.StopPosition.PositionLon}}
            title={d.StopName.Zh_tw} onClick={()=>setOpen(prev=>!prev)}  >
                <Pin background={bg_color} borderColor={"white"} glyphColor={"white"} />
            </AdvancedMarker>
            {open && <InfoWindow position={{lat: d.StopPosition.PositionLat, lng: d.StopPosition.PositionLon}}
             key={d.StopSequence.toString()+"info"} onCloseClick={()=>setOpen(false)} >
                        <div key={d.StopSequence.toString()+"infoElm"} className="">
                            <p>{`${bus} ${headsign}`}</p>
                            <p className="font-bold" >{`${d.StopSequence} ${d.StopName.Zh_tw}`}</p>
                        </div>
            </InfoWindow>}
        </>
    )
}