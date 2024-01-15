'use client'

import { trpc } from "@/app/_trpc/client";
import { BusRouteEstType } from "@/type/BusRouteEstType";
import type { BusRouteType } from "@/type/BusRouteType";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import "./progress.css"
import { useSetStation, useSetToggleShowStopInfo } from "@/utils/BusContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FiMenu, FiPlus} from "react-icons/fi";
import Link from "next/link";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


export default function StopList({routeDetail, direction, bus}: 
    {routeDetail: BusRouteType[], direction: number, bus:string}) {
    
    const router = useRouter()
    const utils = trpc.useUtils()
    const setToggleShowStopInfo = useSetToggleShowStopInfo()
    const setStation = useSetStation()
    const [seconds, setSeconds] = useState(14);
    const isOneWay = (routeDetail.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    let filteredData:BusRouteType["Stops"]
    if (isOneWay) {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus)[0].Stops
    } else {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus && item.Direction === direction)[0].Stops.sort((a, b)=>a.StopSequence - b.StopSequence)
    }
    const routeEst = trpc.getRouteArrivalEst.useQuery(bus, {
        enabled: Boolean(bus ?? ""),
        onSuccess: ()=>{
            setSeconds(14)
            router.refresh()
        }
    })
    

    useEffect(()=>{
        let intervalId: NodeJS.Timeout;
        intervalId = setInterval(()=>{
            if (routeDetail && routeEst.isSuccess) {
                utils.getRouteArrivalEst.refetch()
            }
        }, 15000)
        return ()=>{clearInterval(intervalId)}
      }, [routeEst.isSuccess])
    
      useEffect(()=>{
        let intervalId2: NodeJS.Timeout;
        intervalId2 = setInterval(()=>{
            setSeconds(prev=>prev-0.01)
        }, 10)
        return ()=>{clearInterval(intervalId2)}
      }, [])

      return (
          <>  
            <div className="w-full">

                <div className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 font-bold border-2 rounded-md rounded-b-none p-2 w-full">
                    <span className="w-2/5 text-center">{filteredData[0].StopName.Zh_tw}</span>
                    <span className="w-1/5 flex justify-center "><FaArrowRightLong /></span>
                    <span className="w-2/5 text-center">{filteredData.reverse()[0].StopName.Zh_tw}</span>
                </div>
                <div className="w-ful p-0 overflow-y-hidden">
                    <progress className=" w-full -translate-y-3 " max={14} value={seconds} />
                </div>
            </div>
            <div className=" flex-grow w-full overflow-y-auto flex flex-col gap-3">
                {filteredData.reverse().map((d, )=>{

                    const remainingTimeData = routeEst.data?.filter((item)=>{
                        if (item.Direction === direction && item.RouteName.Zh_tw === bus && item.StopID === d.StopID) {
                            return true
                        }
                    })[0]
                    
                    return (
                        <div key={`${d.StopName.Zh_tw} ${d.StopSequence.toString()}`} className="flex relative items-center pr-4 gap-2">
                            {remainingTimeData?<RemainningTime remainingTimeData={remainingTimeData} />:""}
                            <button className="relative group">
                                <span onClick={()=>{
                                setToggleShowStopInfo({
                                    stopName: d.StopName.Zh_tw,
                                    randomNumber: Math.random()
                                })
                            }} className="text-md pl-1 font-bold">{`${d.StopName.Zh_tw}`}</span>
                                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all"></span>
                                <span className="absolute -bottom-1 right-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all"></span>
                            </button>
                            <div className=" flex-grow" />
                            <button className=" border-2 border-blue-200 font-bold hover:bg-blue-200 hover:text-black transition-all  text-blue-400 p-1 w-fit rounded h-fit text-center"><FiPlus /></button>
                            <DropDownMenu  setStation={setStation} currentStation={d.StopName.Zh_tw} />
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
        return <span className="p-1  rounded w-20 text-center h-fit bg-white">{`${estTime} 分鐘`}</span>
    }
    return <span className="w-20 text-center">末班駛離</span>
}

const DropDownMenu = ({ setStation, currentStation}:
    {setStation: React.Dispatch<React.SetStateAction<string>>, currentStation: string}) => {

    const handleCheckStation = () => {
        setStation(currentStation)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button className=" border-2 border-slate-300 hover:bg-slate-300 hover:text-black transition-all bg-transparant font-bold text-slate-500 p-1 w-fit rounded h-fit text-center"><FiMenu /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <button onClick={handleCheckStation}>查看站牌</button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}