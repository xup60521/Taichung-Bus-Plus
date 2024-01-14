'use client'

import type { AllBusType }  from "@/type/AllBusType" 
import { trpc } from "../../_trpc/client"
import { useEffect, useId, useState } from "react"
import Select from "react-select"
import StopList from "./Bus/StopList"
import { useBus, useDirection, useSetBus, useSetDirection } from "@/utils/BusContext"
import { BusRouteType } from "@/type/BusRouteType"
import { useRouter, useSearchParams } from "next/navigation"

export default function Bus({initBusData, setRouteDetail}: 
    {initBusData: AllBusType[], setRouteDetail: React.Dispatch<React.SetStateAction<BusRouteType[] | null>>}) {
    
    const direction = useDirection()
    const setDirection = useSetDirection()
    const bus = useBus()
    const setBus = useSetBus()
    
    const searchparams = useSearchParams()
    const routeDetail = trpc.getBusRoute.useQuery(bus , {
        enabled: Boolean(bus ?? ""),
        onSuccess: (data) => {
            setRouteDetail([...data])
        }
        
    })
    const regex1 = /^[\u4e00-\u9fa5]/
    const regex2 = /[\u4e00-\u9fa5][0-9]/
    const regex3 = /[\u4e00-\u9fa5A-Z()]/g
    const selectOptions = initBusData.map(d=>{
    return {
        "value": d.RouteName.Zh_tw,
        "label": `${d.RouteName.Zh_tw} ${d.SubRoutes[0].Headsign}`,
    }}).sort((a,b)=>Number(a.value.replace(regex1, "").replace(regex2, "").replace(regex3, "")) - Number(b.value.replace(regex1, "").replace(regex2, "").replace(regex3, "")))
    let isOneWay = false;
    if (Array.isArray(routeDetail.data)) {
        isOneWay = (routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    }

    

    useEffect(()=>{
        const param = searchparams.get("route")
        if (param) {
            setBus(param)
        }
        
    },[])

    return (
        <>
            <div className=" w-full h-full box-border text-black overflow-x-hidden flex flex-col justify-center items-center z-20">
                <div className="flex h-full w-full">
                    <div className="bg-white bg-opacity-50 backdrop-blur-lg  w-full h-full p-4 flex flex-col items-center gap-2 z-50">
                        <p className="font-black text-lg">---選擇路線---</p>
                            <Select onChange={(e)=>{
                                setBus(e?.value ?? "")                            
                            }} options={selectOptions} instanceId={useId()} defaultInputValue={searchparams.get("route") ?? ""} className="text-black w-full" />
                            {Boolean(bus) && <>
                            <div className="w-full flex flex-col items-center justify-center">
                                {!isOneWay && <button onClick={()=>{
                                    if (direction === 1) {setDirection(0)} 
                                    else {setDirection(1)}
                                }} >Change Direction</button>}
                            </div>
                            {routeDetail.isSuccess && <StopList routeDetail={routeDetail.data} direction={direction} bus={bus} />}
                        </>}                         
                    </div>
                </div>
            </div>
        </>
    )
}