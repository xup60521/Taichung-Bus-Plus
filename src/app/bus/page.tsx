'use client'

import type { AllBusType } from "@/type/AllBusType"
import type { BusRouteType } from "@/type/BusRouteType"
import { trpc } from "../_trpc/client"
import Select from "react-select"
import { useEffect, useState } from "react"

export default function Bus() {

   const data = trpc.getAllBus.useQuery() as AllBusType
   const [bus, setBus] = useState("")
   const routeDetail = trpc.getBusRoute.useQuery(bus ?? "") as BusRouteType
   const selectOptions = data.data?.map(d=>{
    return {
        "value": d.RouteName.Zh_tw,
        "label": d.RouteName.Zh_tw
    }
   })

    return (
        <div className=" bg-slate-900 w-screen h-screen text-white overflow-x-hidden flex flex-col justify-center items-center">
            <div className="flex h-5/6">
                <div className="w-96 h-full p-4 flex flex-col items-center gap-2">
                    <p className="font-black">---選擇路線---</p>
                    <Select onChange={(e)=>setBus(e?.value ?? "")} options={selectOptions} className="text-black w-full" />
                    <div className=" flex-grow w-full overflow-y-auto flex flex-col gap-2">
                        <StopList routeDetail={routeDetail} direction={1} bus={bus} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StopList({routeDetail, direction, bus}: {routeDetail: BusRouteType, direction: number, bus:string}) {
    if (!Array.isArray(routeDetail.data)) {
        return ""
    }
    const isOneWay = (routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    let filteredData;
    if (isOneWay) {
        filteredData = routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus)[0].Stops
    } else {
        filteredData = routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus && item.Direction === direction)[0].Stops
    }
    

    return (
        <>
            {filteredData.map(d=>{
                return (
                    <div>
                        <span className="text-xl">{d.StopName.Zh_tw}</span>
                    </div>
                )
            })}
        </>
    )
}