'use client'

import { trpc } from "@/app/_trpc/client";
import type { BusRouteType } from "@/type/BusRouteType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRightArrowLeft, FaArrowRightLong } from "react-icons/fa6";
import "./progress.css"
import { useSetDirection, useSetPage, useSetStationName, useSetStayOnRouteDetails, useSetToggleShowStopInfo } from "@/utils/BusContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FiMenu, FiPlus} from "react-icons/fi";
import { RemainningTime } from "./RemainningTime";
import { useToast } from "@/components/ui/use-toast";

export default function StopList({routeDetail, direction, bus}: 
    {routeDetail: BusRouteType[], direction: number, bus:string}) {
    
    const router = useRouter()
    const utils = trpc.useUtils()
    const setToggleShowStopInfo = useSetToggleShowStopInfo()
    const setStationName = useSetStationName()
    const [seconds, setSeconds] = useState(14);
    const setPage = useSetPage()
    const setDirection = useSetDirection()
    const {toast} = useToast()
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
                <div className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 font-bold border-2 rounded-md rounded-b-none p-2 w-full h-12">
                    <span className="w-2/5 text-center">{filteredData[0].StopName.Zh_tw}</span>
                    <button className="w-8 h-8 p-1 flex justify-center items-center" onClick={()=>{
                        if (!isOneWay) {
                            if (direction === 1) {setDirection(0)} 
                            else {setDirection(1)}
                        }
                        else {
                            toast({
                                title: "Error",
                                description: `${bus} 僅行駛單方向`,
                            })
                        }
                    }}>{isOneWay ? <FaArrowRightLong /> : <FaArrowRightArrowLeft />}</button>
                    <span className="w-2/5 text-center">{filteredData.reverse()[0].StopName.Zh_tw}</span>
                </div>
                <div className="w-full p-0 overflow-y-hidden">
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
                            <DropDownMenu  setStationName={setStationName} currentStationName={d.StopName.Zh_tw} setPage={setPage} />
                        </div>
                    )
                })}
            </div>
            
        </>
    )
}



const DropDownMenu = ({ setStationName, currentStationName, setPage}:
    {
        setStationName: React.Dispatch<React.SetStateAction<string>>, 
        currentStationName: string,
        setPage: React.Dispatch<React.SetStateAction<string>>, 
     }) => {

    const handleCheckStation = () => {
        setStationName(currentStationName)
        setPage("bus_stop")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button className=" border-2 border-slate-300 hover:bg-slate-300 hover:text-black transition-all bg-transparant font-bold text-slate-500 p-1 w-fit rounded h-fit text-center"><FiMenu /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleCheckStation}>
                    <span>查看站牌</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}