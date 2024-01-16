'use client'

import type { AllBusType }  from "@/type/AllBusType" 
import { trpc } from "../../_trpc/client"
import { useEffect, useId, useState } from "react"
import Select from "react-select"
import StopList from "./Bus/StopList"
import { useBus, useDirection, useSetBus, useSetDirection, useSetRouteDetail } from "@/utils/BusContext"
import { BusRouteType } from "@/type/BusRouteType"
import { useRouter, useSearchParams } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import {RNN} from "@/lib/RouteNameNormalize"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CommandInput, CommandEmpty, CommandGroup, CommandItem } from "cmdk"
import { Command } from "@/components/ui/command"


export default function Bus({initBusData}: 
    {initBusData: AllBusType[]}) {
    
    const direction = useDirection()
    const setDirection = useSetDirection()
    const setRouteDetail = useSetRouteDetail()
    const bus = useBus()
    const setBus = useSetBus()
    const [loading, setLoading] = useState(true)
    const searchparams = useSearchParams()
    const routeDetail = trpc.getBusRoute.useQuery(bus , {
        enabled: Boolean(bus ?? ""),
        onSuccess: (data) => {
            setRouteDetail([...data])
        }
        
    })
 
    const selectOptions = initBusData.map(d=>{
    return {
        "value": d.RouteName.Zh_tw,
        "label": `${d.RouteName.Zh_tw} ${d.SubRoutes[0].Headsign}`,
    }}).sort((a,b)=>Number(RNN(a.value)) - Number(RNN(b.value)))
    let isOneWay = false;
    if (Array.isArray(routeDetail.data)) {
        isOneWay = (routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    }

    const defaultOption = {
        value: searchparams.get("route"),
        label: selectOptions.find(item => item.value === searchparams.get("route"))?.label
    }

   

    return (
        <>
            <div className=" w-full h-full box-border text-black overflow-x-hidden flex flex-col justify-center items-center">
                <div className="flex h-full w-full">
                    <div className="bg-white bg-opacity-50 backdrop-blur-lg  w-full h-full p-4 flex flex-col items-center gap-2">
                        <p className="font-black text-lg">---選擇路線---</p>
                            {/* <Select onChange={(e)=>{
                                setBus(e?.value ?? "")                            
                            }} options={selectOptions} instanceId={useId()}  className="text-black w-full" /> */}
                            <ComboboxDemo selectOptions={selectOptions} />
                            {Boolean(bus) && <>
                            <div className="w-full flex flex-col items-center justify-center">
                            </div>
                            {routeDetail.isSuccess && <StopList routeDetail={routeDetail.data} direction={direction} bus={bus} />}
                        </>}                         
                    </div>
                </div>
            </div>
        </>
    )
}


export function ComboboxDemo({selectOptions}:{selectOptions: {
    label: string,
    value: string
}[]}) {
    const [open, setOpen] = useState(false)
  const value = useBus()
  const setValue = useSetBus()
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? selectOptions.find((framework) => framework.value === value)?.label
            : "Select framework..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-min p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9 p-2 m-2 border-2 rounded" />
          <CommandEmpty>No Bus Found.</CommandEmpty>
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