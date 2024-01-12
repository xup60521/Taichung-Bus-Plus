'use client'

import type { AllBusType } from "@/type/AllBusType";
import { Routes, Route, NavLink, HashRouter } from "react-router-dom"
import { FaBus } from "react-icons/fa";
import Bus from "./_component/Bus";
import { useBus, useDirection, usePosition } from "@/utils/BusContext";
import { trpc } from "../_trpc/client";
import { useState } from "react";
import { BusRouteType } from "@/type/BusRouteType";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { publicENV } from "@/lib/publicENV";
import StopsMarker from "./_component/StopsMaker";

export default function Nav({initData}: {initData: AllBusType[]}) {

    const bus = useBus()
    const position = usePosition()
    const direction = useDirection()
    const [routeDetail, setRouteDetail] = useState<BusRouteType[] | null>(null)
    
    return (
        {typeof window === "undefined" ? "" : <HashRouter>
            <div className="absolute w-full h-full box-border flex bg-red-300">
                <nav className="h-full w-12 z-20 bg-white flex flex-col justify-center items-center">
                    <NavLink to={"/"} className=""><FaBus /></NavLink>
                </nav>   
                <main className="h-full w-full flex-grow overflow-x-hidden bg-slate-400">
                    <Routes>
                        <Route path="/" element={<Bus setRouteDetail={setRouteDetail} initData={initData} />} />
                    </Routes>
                </main>
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
        </HashRouter>}
    )
}
