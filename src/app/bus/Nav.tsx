'use client'

import type { AllBusType } from "@/type/AllBusType";
import { FaBus, FaShekelSign } from "react-icons/fa";
import Bus from "./_component/Bus";
import { useBus, useDirection, usePage, usePosition, useSetBus, useSetDirection, useSetPage, useSetRouteDetail, useSetStationName, useStationName } from "@/utils/BusContext";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { trpc } from "../_trpc/client";

export default function Nav({initBusData}: 
    {initBusData: AllBusType[]}) {

    const bus = useBus()
    const setBus = useSetBus()
    const position = usePosition()
    const stationName = useStationName()
    const setStationName = useSetStationName()
    const searchparams = useSearchParams()
    const direction = useDirection()
    const setDirection = useSetDirection()
    const setRouteDetail = useSetRouteDetail()
    const router = useRouter()
    const page = usePage()
    const setPage = useSetPage()
    const [loading, setLoading] = useState(true)
    const routeDetail = trpc.getBusRoute.useQuery(bus , {
        enabled: Boolean(bus ?? ""),
        onSuccess: (data) => {
            setRouteDetail([...data])
        }        
    }).data

    useEffect(()=>{
        const sBus = searchparams.get("route")
        const sPage = searchparams.get("page")
        const sStationName = searchparams.get("stationName")
        const sDirection = searchparams.get("direction")
        if (sBus) {
            setBus(sBus)
        }
        if (sPage) {
            setPage(sPage)
        } else {setPage("bus")}
        if (sStationName) {
            setStationName(sStationName)
        }
        if (sDirection) {
            setDirection(Number(sDirection))
        }
        setLoading(false)
    },[])
    
    useEffect(()=>{
        if (!loading) {
            router.push(`?page=${page}&route=${bus}&stationName=${stationName}&direction=${direction}`, {
                scroll: false        
            })
        }
        }, [bus, page,stationName, direction])

    if (typeof window === "undefined") {
        return <div>browser window is not ready</div>
    }
    
    return (
        <>
            <div className="w-full h-screen box-border flex bg-gradient-to-b from-rose-100 to-teal-100 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={2}>
                        <div className="h-full w-full bg-white flex flex-col justify-center items-center gap-2">
                            <button onClick={()=>setPage("bus")}  className={`${page === "bus" ? "bg-slate-200" : ""} flex justify-center items-center p-2 hover:bg-slate-200`}><FaBus /></button>
                            <button onClick={()=>setPage("bus_stop")} className={`${page === "bus_stop" ? "bg-slate-200" : ""} flex justify-center items-center p-2 hover:bg-slate-200`} ><FaShekelSign /></button>
                        </div>                          
                    </ResizablePanel>
                    <ResizableHandle className="w-1" />
                    <ResizablePanel defaultSize={25}>
                        <div className="h-full w-full flex-grow overflow-x-hidden">
                            {(()=>{
                                if (page === "bus" || page === "") {
                                    return <Bus initBusData={initBusData} routeDetail={routeDetail} />
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
                        <div className="h-screen w-full">
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
