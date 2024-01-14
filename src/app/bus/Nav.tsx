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
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"

export default function Nav({initBusData}: 
    {initBusData: AllBusType[]}) {

    const bus = useBus()
    const setBus = useSetBus()
    const position = usePosition()
    const searchparams = useSearchParams()
    const router = useRouter()
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
            <div className="absolute w-full h-full box-border flex bg-gradient-to-b from-rose-100 to-teal-100 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={2}>
                        <div className="h-full w-full z-50 bg-white flex flex-col justify-center items-center gap-2">
                            <button onClick={()=>setPage("bus")}  className={`${page === "bus" ? "bg-slate-200" : ""} flex justify-center items-center p-2 hover:bg-slate-200`}><FaBus /></button>
                            <button onClick={()=>setPage("bus_stop")} className={`${page === "bus_stop" ? "bg-slate-200" : ""} flex justify-center items-center p-2 hover:bg-slate-200`} ><FaShekelSign /></button>
                        </div>  
                    </ResizablePanel>
                    <ResizableHandle className="w-1" />
                    <ResizablePanel defaultSize={25}>
                        <div className="h-full w-full flex-grow overflow-x-hidden">
                            {(()=>{
                                if (page === "bus" || page === "") {
                                    return <Bus initBusData={initBusData} />
                                }
                                if (page === "bus_stop") {
                                    return <BusStop />
                                }
                                return ""
                            })()}
                        </div>
                    </ResizablePanel>
                    <ResizableHandle className="w-1.5" />
                    <ResizablePanel>
                        <div className="h-screen w-screen absolute">
                            <APIProvider apiKey={publicENV.NEXT_PUBLIC_Google_Map_API_Key??""}>
                                <Map
                                zoom={11.5}
                                center={position}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                                mapId={publicENV.NEXT_PUBLIC_Google_Map_ID}
                                >
                                    <StopsMarker />   
                                </Map>
                            </APIProvider>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>                 
            </div>
        </>
    )
}
