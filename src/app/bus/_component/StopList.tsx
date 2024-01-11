'use client'

import { trpc } from "@/app/_trpc/client";
import { BusRouteEstType } from "@/type/BusRouteEstType";
import type { BusRouteType } from "@/type/BusRouteType";
import { useRouter } from "next/navigation";
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

export default function StopList({routeDetail, direction, bus}: 
    {routeDetail: BusRouteType[], direction: number, bus:string}) {
    
    const router = useRouter()
    const utils = trpc.useUtils()
    const isOneWay = (routeDetail.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    let filteredData:BusRouteType["Stops"]
    if (isOneWay) {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus)[0].Stops
    } else {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus && item.Direction === direction)[0].Stops.sort((a, b)=>a.StopSequence - b.StopSequence)
    }
    const routeEst = trpc.getRouteArrivalEst.useQuery(bus, {
        enabled: Boolean(bus ?? "")
    })

    useEffect(()=>{
        let intervalId: NodeJS.Timeout;
        intervalId = setInterval(()=>{
            if (routeDetail && routeEst.isSuccess) {
                utils.getRouteArrivalEst.invalidate()
                router.refresh()
            }
        }, 10000)
        return ()=>{clearInterval(intervalId)}
      }, [])
    

    return (
        <>  
            <div className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 font-bold border-2 rounded-md p-2 w-full">
                <span className="w-2/5 text-center">{filteredData[0].StopName.Zh_tw}</span>
                <span className="w-1/5 flex justify-center "><FaArrowRightLong /></span>
                <span className="w-2/5 text-center">{filteredData.reverse()[0].StopName.Zh_tw}</span>
            </div>
            
            <div className=" flex-grow w-full overflow-y-auto flex flex-col gap-2">
                {filteredData.reverse().map((d, )=>{

                    const remainingTimeData = routeEst.data?.filter((item)=>{
                        if (item.Direction === direction && item.RouteName.Zh_tw === bus && item.StopID === d.StopID) {
                            return true
                        }
                    })[0]
                    
                    return (
                        <div key={`${d.StopName.Zh_tw} ${d.StopSequence.toString()}`} className="flex justify-between items-center pr-4">
                            <span className="text-lg">{`${d.StopName.Zh_tw}`}</span>
                            {remainingTimeData?<RemainningTime remainingTimeData={remainingTimeData} />:""}
                        </div>
                    )
                })}
            </div>
            
        </>
    )
}

const RemainningTime = ({remainingTimeData}:
    {remainingTimeData:BusRouteEstType}) => {
    if (remainingTimeData.StopStatus === 1 && remainingTimeData.NextBusTime) {
        const t = new Date(remainingTimeData.NextBusTime)
        const hours = String(t.getHours()).padStart(2, '0');
        const minutes = String(t.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        return <span className=" border-2 border-slate-300 p-1 w-20 rounded h-fit text-center">{formattedTime}</span>
    } 
    if (remainingTimeData.StopStatus === 0 && typeof remainingTimeData.EstimateTime === "number") {
        const estTime = (Math.ceil(Number(remainingTimeData?.EstimateTime))/60-1)
        if (estTime <= 0) {
            return <span className="bg-red-500 w-20 text-center text-white p-1  rounded h-fit ">進站中</span>
        }
        if (estTime <= 3) {
            return <span className="bg-red-100 w-20 text-center text-red-800 p-1  rounded h-fit ">{`${estTime} 分鐘`}</span>
        }
        return <span className="p-1  rounded w-20 text-center h-fit ">{`${estTime}分鐘`}</span>
    }
    return <span className="w-20 text-center">末班駛離</span>
}