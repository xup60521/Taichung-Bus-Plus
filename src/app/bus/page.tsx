'use client'

import type { AllBusType } from "@/type/AllBusType"
import type { BusRouteType } from "@/type/BusRouteType"
import { trpc } from "../_trpc/client"
import Select from "react-select"
import { useEffect, useId, useState } from "react"
import { FaArrowRightLong } from "react-icons/fa6";

export default function Bus() {

   const data = trpc.getAllBus.useQuery() as AllBusType
   const [bus, setBus] = useState("")
   const routeDetail = trpc.getBusRoute.useQuery(bus ?? "") as BusRouteType
   const [order, setOrder] = useState(0)
   const selectOptions = data.data?.map(d=>{
    return {
        "value": d.RouteName.Zh_tw,
        "label": d.RouteName.Zh_tw,
        "key": d.RouteName.Zh_tw,
    }
   })
   const isOneWay = (routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false

    return (
        <div className=" bg-slate-900 w-screen h-screen text-white overflow-x-hidden flex flex-col justify-center items-center">
            <div className="flex h-5/6">
                <div className="w-96 h-full p-4 flex flex-col items-center gap-4">
                    <p className="font-black">---選擇路線---</p>
                    <Select onChange={(e)=>setBus(e?.value ?? "")} options={selectOptions} instanceId={useId()} className="text-black w-full" />
                    <div>
                        {!isOneWay && <button onClick={()=>{
                            setOrder((prev)=>{
                                if (prev === 1) {return 0}
                                return 1
                            })
                        }}>Change Direction</button>}
                    </div>
                    <StopList routeDetail={routeDetail} direction={order} bus={bus} />                    
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
            <div className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 font-bold border-2 rounded-md p-2 w-full">
                <span className="w-2/5 text-center">{filteredData[0].StopName.Zh_tw}</span>
                <span className="w-1/5 flex justify-center "><FaArrowRightLong /></span>
                <span className="w-2/5 text-center">{filteredData.reverse()[0].StopName.Zh_tw}</span>
            </div>
            <div className=" flex-grow w-full overflow-y-auto flex flex-col gap-2">
                {filteredData.reverse().map(d=>{
                    return (
                        <div key={d.StopName.Zh_tw}>
                            <span className="text-xl">{d.StopName.Zh_tw}</span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}