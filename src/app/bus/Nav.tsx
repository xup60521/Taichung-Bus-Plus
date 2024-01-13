'use client'

import type { AllBusType } from "@/type/AllBusType";
import { FaBus, FaShekelSign } from "react-icons/fa";
import Bus from "./_component/Bus";
import { useBus, useDirection, usePosition } from "@/utils/BusContext";
import { useState } from "react";
import { BusRouteType } from "@/type/BusRouteType";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { publicENV } from "@/lib/publicENV";
import StopsMarker from "./_component/Bus/StopsMaker";

export default function Nav({initData}: {initData: AllBusType[]}) {

    const bus = useBus()
    const position = usePosition()
    const direction = useDirection()
    const [routeDetail, setRouteDetail] = useState<BusRouteType[] | null>(null)

   if (typeof window === "undefined") {
     return <div>browser window is not ready</div>
   }

    
    return (
        <>
            <div className="absolute w-full h-full box-border flex bg-red-300">
                <div className="h-full w-12 z-20 bg-white flex flex-col justify-center items-center gap-6">
                    <a  className=" h-2 active:text-red-700"><FaBus /></a>
                    <a ><FaShekelSign /></a>
                </div>   
                <div className="h-full w-full flex-grow overflow-x-hidden bg-slate-400">
                    <Bus setRouteDetail={setRouteDetail} initData={initData} />
                </div>
            </div>
            <div className="absolute h-full w-full z-10 left-0">
                <APIProvider apiKey={publicENV.NEXT_PUBLIC_Google_Map_API_Key??""}>
                    <Map
                    zoom={11.5}
                    center={position}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    mapId={publicENV.NEXT_PUBLIC_Google_Map_ID}
                    >
                        <StopsMarker routeDetail={routeDetail} direction={direction} bus={bus} />   
                    </Map>
                </APIProvider>
            </div>
        </>
    )
}
