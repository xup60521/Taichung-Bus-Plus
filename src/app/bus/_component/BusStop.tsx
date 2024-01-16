'use client'

import { trpc } from "@/app/_trpc/client"
import { RNN } from "@/lib/RouteNameNormalize"
import { useSetBus, useSetDirection, useSetPage, useStationName } from "@/utils/BusContext"
import { useEffect, useState } from "react"
import { RemainningTime } from "./Bus/RemainningTime"
import { FiMenu, FiPlus } from "react-icons/fi"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Spinner from "@/app/_components/Spinner"


export default function BusStop() {

    const stationName = useStationName()
    const setBus = useSetBus()
    const setPage = useSetPage()
    const setDirection = useSetDirection()
    const stationRoutesEst = trpc.getStationRouteEst.useQuery(stationName, {
        enabled: Boolean(stationName ?? ""),
        onSuccess: ()=>{
            setSeconds(14)
        }
    })
    const [seconds, setSeconds] = useState(14);
    const utils = trpc.useUtils()

    useEffect(()=>{
        let intervalId: NodeJS.Timeout;
        intervalId = setInterval(()=>{
            if (stationRoutesEst.isSuccess) {
                utils.getStationRouteEst.refetch()
            }
        }, 15000)
        return ()=>{clearInterval(intervalId)}
      }, [stationRoutesEst.isSuccess])

    useEffect(()=>{
        let intervalId2: NodeJS.Timeout;
        intervalId2 = setInterval(()=>{
            setSeconds(prev=>prev-0.01)
        }, 10)
        return ()=>{clearInterval(intervalId2)}
      }, [])
    
    return (
        !stationName ? "": <>
            <div className=" w-full h-full box-border text-black overflow-x-hidden flex flex-col justify-center items-center z-20">
                <div className="flex h-full w-full">
                    <div className="bg-white bg-opacity-50 backdrop-blur-lg  w-full h-full p-4 flex flex-col items-center gap-4">
                        <div className="w-full">
                            <h1 className="w-full text-center text-lg font-bold bg-white rounded-lg p-2 rounded-b-none">{stationName}</h1>
                            <div className="w-full p-0 overflow-y-hidden">
                                <progress className=" w-full -translate-y-3 " max={14} value={seconds} />
                            </div>
                        </div>
                        <div className="w-full flex-grow overflow-y-scroll flex flex-col gap-3">       
                        {stationRoutesEst.isSuccess ? stationRoutesEst.data.sort((a,b)=>Number(RNN(a.RouteName.Zh_tw)) - Number(RNN(b.RouteName.Zh_tw))).map(d=>{
                            return (
                            <div key={`${d.RouteName.Zh_tw} ${d.Direction} ${d.StopSequence}`} className="flex relative items-center pr-4 gap-2" >
                                <RemainningTime remainingTimeData={d} />
                                <span className="pl-2 font-medium text-md">{`${d.RouteName.Zh_tw}`}</span>
                                <div className="flex-grow" />
                                <DropDownMenu setBus={setBus} currentRouteName={d.RouteName.Zh_tw} currentRouteDirection={d.Direction} setPage={setPage} setDirection={setDirection} />
                            </div>
                            )
                        }) : <div className="w-full flex-grow flex justify-center items-center">
                        <Spinner />
                      </div>}                         
                        </div>                                                   
                    </div>
                </div>
            </div>
        </>
    )
}

const DropDownMenu = ({ setBus, currentRouteName, currentRouteDirection ,setPage, setDirection}:
    {
        setBus: React.Dispatch<React.SetStateAction<string>>, 
        currentRouteName: string,
        currentRouteDirection: number,
        setPage: React.Dispatch<React.SetStateAction<string>>, 
        setDirection: React.Dispatch<React.SetStateAction<number>>
     }) => {

    const handleCheckStation = () => {
        setBus(currentRouteName)
        setDirection(currentRouteDirection)
        setPage("bus")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button className=" border-2 border-slate-300 hover:bg-slate-300 hover:text-black transition-all bg-transparant font-bold text-slate-500 p-1 w-fit rounded h-fit text-center"><FiMenu /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleCheckStation}>
                    <span>查看路線</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>


    )
}