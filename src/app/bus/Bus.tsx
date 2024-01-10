'use client'

import type { Datum }  from "@/type/AllBusType" 
import type { BusRouteType } from "@/type/BusRouteType"
import { trpc } from "../_trpc/client"
import Select from "react-select"
import { useId, useState } from "react"
import { FaArrowRightLong } from "react-icons/fa6";
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import { publicENV } from "@/lib/publicENV"
import GMap from "./_component/GMap"

export default function Bus({initData}: {initData: Datum[]}) {
    
   const [bus, setBus] = useState("")
   const routeDetail = trpc.getBusRoute.useQuery(bus ?? "") as BusRouteType
   const [order, setOrder] = useState(0)
   const selectOptions = initData.map(d=>{
    return {
        "value": d.RouteName.Zh_tw,
        "label": d.RouteName.Zh_tw,
        "key": d.RouteName.Zh_tw,
    }
   })
   let isOneWay = false;
   if (Array.isArray(routeDetail.data)) {
        isOneWay = (routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
   }

    return (
        <>
            <div className=" w-screen h-screen text-black overflow-x-hidden flex flex-col justify-center items-center z-20">
                <div className="flex h-full w-full">
                    <div className="bg-white bg-opacity-50 backdrop-blur-lg  w-96 h-full p-4 flex flex-col items-center gap-4 z-50">
                        <p className="font-black text-lg">---選擇路線---</p>
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
                <div className="absolute h-screen w-screen z-10">
                    <GMap />
                </div>
            </div>
            
        </>
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

