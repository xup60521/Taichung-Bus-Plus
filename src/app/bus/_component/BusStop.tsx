'use client'

import { trpc } from "@/app/_trpc/client"
import { useStationName } from "@/utils/BusContext"


export default function BusStop() {

    const stationName = useStationName()
    const stationRoutes = trpc.getStationRoute.useQuery(stationName, {
        enabled: Boolean(stationName ?? "")
    })
    const regex1 = /^[\u4e00-\u9fa5]/
    const regex2 = /[\u4e00-\u9fa5][0-9]/
    const regex3 = /[\u4e00-\u9fa5A-Z()]/g
    
    return (
        <>
            <div className=" w-full h-full box-border text-black overflow-x-hidden flex flex-col justify-center items-center z-20">
                <div className="flex h-full w-full">
                    <div className="bg-white bg-opacity-50 backdrop-blur-lg  w-full h-full p-4 flex flex-col items-center gap-2">
                        <p className="font-black text-lg">---站牌---</p>
                        {!stationRoutes.isSuccess ?
                         "":
                         <>
                            <h1 className="w-full text-center text-lg font-bold bg-white rounded-lg p-2">{stationRoutes.data[0].StationName.Zh_tw}</h1>
                            <div className="w-full flex-grow overflow-y-scroll">
                                {stationRoutes.data.map((d)=>{
                                    return <>
                                        {d.Stops.map(item=>{
                                            return <div key={item.StopID}>{item.RouteName.Zh_tw}</div>
                                        })}
                                    </>
                                })}
                            </div>
                         </>
                          }
                    </div>
                </div>
            </div>
        </>
    )
}