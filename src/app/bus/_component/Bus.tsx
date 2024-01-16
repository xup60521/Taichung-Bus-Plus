'use client'

import type { AllBusType }  from "@/type/AllBusType" 
import { useState } from "react"
import StopList from "./Bus/StopList"
import { useBus, useDirection, useRouteDetail, useSetBus, useSetStayOnRouteDetails, useStayOnRouteDetails } from "@/utils/BusContext"
import { BusRouteType } from "@/type/BusRouteType"
import {RNN} from "@/lib/RouteNameNormalize"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CommandInput, CommandEmpty, CommandGroup, CommandItem } from "cmdk"
import { Command } from "@/components/ui/command"
import Spinner from "@/app/_components/Spinner"
import { FiPlus,FiMinus  } from "react-icons/fi"
import { toast } from "@/components/ui/use-toast"


export default function Bus({initBusData, routeDetail}: 
  {initBusData: AllBusType[], routeDetail: BusRouteType[] | undefined}) {

  const direction = useDirection()
  const bus = useBus()
  const stayOnRouteDetails = useStayOnRouteDetails()
  const setStayOnRouteDetails = useSetStayOnRouteDetails()
  const selectOptions = initBusData.map(d=>{
  return {
    "value": d.RouteName.Zh_tw,
    "label": `${d.RouteName.Zh_tw} ${d.SubRoutes[0].Headsign}`,
  }}).sort((a,b)=>Number(RNN(a.value)) - Number(RNN(b.value)))
  let isOneWay = false;
  if (Array.isArray(routeDetail)) {
    isOneWay = (routeDetail.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
  }

  const addToList = () => {
    if ((!routeDetail || !bus)||(stayOnRouteDetails.map(d=>d.RouteName.Zh_tw).includes(bus) && stayOnRouteDetails.map(d=>d.Direction).includes(direction))) {
      return;
    }
    let filteredData:BusRouteType;
    if (isOneWay) {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus)[0]
    } else {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus && item.Direction === direction)[0]
    }
    setStayOnRouteDetails(prev => [...prev, filteredData])
    toast({
      title: "新增成功"
    })
  }

  const removeFromList = () => {
    setStayOnRouteDetails(prev => {
      return prev.filter(item=> item.RouteName.Zh_tw !== bus || item.Direction !== direction)
    })
    toast({
      title: "成功刪除"
    })
  }

  const isAdded = Boolean(stayOnRouteDetails.filter(item=> item.RouteName.Zh_tw===bus && item.Direction===direction).length)

  return (
    <>
        <div className=" w-full h-full box-border text-black overflow-x-hidden flex flex-col justify-center items-center">
            <div className="flex h-full w-full">
                <div className="bg-white bg-opacity-50 backdrop-blur-lg  w-full h-full p-4 flex flex-col items-center gap-2">
                    <p className="font-black text-lg">---選擇路線---</p>
                        <div className="w-full flex items-center gap-2">
                          <ComboboxDemo isOneWay={isOneWay} direction={direction} selectOptions={selectOptions} />
                          {(!bus) ? "" : (isAdded ? <button onClick={removeFromList} className=" box-border w-10 h-full border-2 border-red-400 text-2xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-all  text-red-400 p-1 rounded flex justify-center items-center"><FiMinus /></button> :
                          <button onClick={addToList} className="w-10 h-full bg-white font-bold hover:bg-slate-600 hover:text-white transition-all  text-blue-800 p-1 rounded flex justify-center items-center"><FiPlus /></button>
                          )}
                        </div>
                        {Boolean(bus) && <>
                       
                        {routeDetail ? <StopList routeDetail={routeDetail} direction={direction} bus={bus} /> 
                        : <div className="w-full flex-grow flex justify-center items-center">
                            <Spinner />
                          </div>}
                    </>}                         
                </div>
            </div>
        </div>
    </>
  )
}


export function ComboboxDemo({selectOptions, direction, isOneWay}:
  {selectOptions: {
    label: string,
    value: string
}[], direction: number, isOneWay:boolean}) {
    const [open, setOpen] = useState(false)
  const value = useBus()
  const setValue = useSetBus()
  const placeholder = selectOptions.find((framework) => framework.value === value)?.label
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="whitespace-normal	flex-grow h-fit text-wrap flex-shrink"
        >
          <p>

          {value
            ? (placeholder ? (
              placeholder + (!isOneWay ? (direction === 0 ? " (順向)" : " (逆向)") : "")
            ) : "")
            : "Select bus..."}
          </p>

        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-min p-0">
        <Command>
          <CommandInput placeholder="Search bus..." className="h-9 p-2 m-2 border-2 rounded" />
          <CommandEmpty className="p-4">No Bus Found.</CommandEmpty>
          <CommandGroup className=" overflow-y-scroll h-96 ">
            {selectOptions.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
                className=" hover:bg-blue-100 px-4 py-2"
              >
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// (!isOneWay && (direction === 0 ? "順向" : "逆向"))