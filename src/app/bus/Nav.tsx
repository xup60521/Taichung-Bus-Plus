'use client'

import type { AllBusType } from "@/type/AllBusType";
import { FaBus, FaShekelSign } from "react-icons/fa";
import Bus from "./_component/Bus";
import { useBus, useDirection, usePosition, useSetBus } from "@/utils/BusContext";
import { useEffect, useState } from "react";
import { BusRouteType } from "@/type/BusRouteType";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { publicENV } from "@/lib/publicENV";
import StopsMarker from "./_component/Bus/StopsMaker";
import { useRouter, useSearchParams } from "next/navigation";
import BusStop from "./_component/BusStop";
import { AllStationType } from "@/type/AllStationType";

export default function Nav({initBusData, initAllStation}: 
    {initBusData: AllBusType[], initAllStation: AllStationType[]}) {

    const bus = useBus()
    const setBus = useSetBus()
    const position = usePosition()
    const direction = useDirection()
    const searchparams = useSearchParams()
    const router = useRouter()
    const [routeDetail, setRouteDetail] = useState<BusRouteType[] | null>(null)
    const [page, setPage] = useState<string | "bus" | "bus_stop">("")
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const sBus = searchparams.get("bus")
        const sPage = searchparams.get("page")
        if (sBus) {
            setBus(sBus)
        }
        if (sPage) {
            setPage(sPage)
        } else {setPage("bus")}
        
        setLoading(false)
    },[])
    
    useEffect(()=>{
        if (!loading) {
            router.push(`?page=${page}&route=${bus}`, {
                scroll: false        })
        }
        }, [bus, page])

    if (typeof window === "undefined") {
        return <div>browser window is not ready</div>
    }
    
    return (
        <>
            <div className="absolute w-full h-full box-border flex bg-red-300">
                <div className="h-full w-fit z-20 bg-white flex flex-col justify-center items-center gap-2">
                    <button onClick={()=>setPage("bus")}  className={`${page === "bus" ? "bg-slate-200" : ""} flex justify-center items-center p-2 hover:bg-slate-200`}><FaBus /></button>
                    <button onClick={()=>setPage("bus_stop")} className={`${page === "bus_stop" ? "bg-slate-200" : ""} flex justify-center items-center p-2 hover:bg-slate-200`} ><FaShekelSign /></button>
                </div>   
                <div className="h-full w-full flex-grow overflow-x-hidden bg-slate-400">
                    {(()=>{
                        if (page === "bus" || page === "") {
                            return <Bus setRouteDetail={setRouteDetail} initBusData={initBusData} />
                        }
                        if (page === "bus_stop") {
                            return <BusStop initAllStation={initAllStation} />
                        }
                        return ""
                    })()}
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
