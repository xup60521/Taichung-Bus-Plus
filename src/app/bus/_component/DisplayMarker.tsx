'use client'

import type { BusRouteType } from "@/type/BusRouteType";
import type { Unpacked } from "@/type/TypeOperator";
import { InfoWindow, Marker, useMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";

export default function DisplayMarker({d}:{d: Unpacked<Unpacked<BusRouteType["data"]>["Stops"]>}) {
    const [markerRef, marker] = useMarkerRef();
    const [open, setOpen] = useState(false)
    
    return (
        <>
            <Marker ref={markerRef} position={{lat: d.StopPosition.PositionLat, lng: d.StopPosition.PositionLon}}
                        title={d.StopName.Zh_tw} onClick={()=>setOpen(prev=>!prev)}  />
            {open && <InfoWindow anchor={marker} key={d.StopSequence.toString()+"info"} onCloseClick={()=>setOpen(false)} >
                        <div key={d.StopSequence.toString()+"infoElm"} className="">
                            <p className="font-bold" >{`${d.StopSequence} ${d.StopName.Zh_tw}`}</p>
                        </div>
                    </InfoWindow>}
        </>
    )
}