'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useSetBus, useSetDirection, useSetPage, useSetStayOnRouteDetails, useStayOnRouteDetails } from "@/utils/BusContext"
import { FiMenu, FiTrash } from "react-icons/fi"

export default function BusList() {

    const stayOnRouteDetails = useStayOnRouteDetails()
    const setStayOnRouteDetails = useSetStayOnRouteDetails()
    const setBus = useSetBus()
    const setDirection = useSetDirection()
    const setPage = useSetPage()

    const deleteItem = (bus:string, direction:number) => {
        setStayOnRouteDetails(prev => {
            return prev.filter(item=>item.RouteName.Zh_tw!==bus || item.Direction !== direction)
        })
        toast({
            title: "刪除成功"
        })
    }

    return (
        <>
            <div className=" w-full h-full box-border text-black overflow-x-hidden flex flex-col justify-center items-center">
                <div className="flex h-full w-full">
                    <div className="bg-white bg-opacity-50 backdrop-blur-lg  w-full h-full p-4 flex flex-col items-center gap-2">
                        <p className="font-black text-lg">疊加路線</p>
                        {stayOnRouteDetails.map(item=>{
                            item.Stops.sort((a,b)=> a.StopSequence - b.StopSequence)
                            const headSign = `${item.Stops[0].StopName.Zh_tw} - ${item.Stops.reverse()[0].StopName.Zh_tw}`
                            return (
                                <div key={`${item.RouteName.Zh_tw} ${item.Direction}`} className="flex items-center w-full gap-2">
                                    <span>{item.RouteName.Zh_tw}</span>
                                    <span>{headSign}</span>
                                    <div className="flex-grow" />
                                    <button onClick={()=>{deleteItem(item.RouteName.Zh_tw, item.Direction)}} className="border-2 border-red-500 w-fit h-fit p-1 transition-all rounded text-red-500 hover:bg-red-500 hover:text-white"><FiTrash /></button>
                                    <DropDownMenu bus={item.RouteName.Zh_tw} setBus={setBus} direction={item.Direction} setDirection={setDirection} setPage={setPage} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

function DropDownMenu({bus, direction, setBus, setDirection, setPage}: 
    {bus: string, direction: number, setBus: React.Dispatch<React.SetStateAction<string>>, setDirection: React.Dispatch<React.SetStateAction<number>>, setPage: React.Dispatch<React.SetStateAction<string>>}) {

    const handleCheckBus = () => {
        setBus(bus.toUpperCase())
        setDirection(direction)
        setPage("bus")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button className=" border-2 border-slate-300 hover:bg-slate-300 hover:text-black transition-all bg-transparant font-bold text-slate-500 p-1 w-fit rounded h-fit text-center"><FiMenu /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleCheckBus}>
                    <span>查看路線</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}