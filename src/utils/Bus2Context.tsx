'use client'

import { BusRouteType } from "@/type/BusRouteType"
import { createContext, useContext, useState } from "react"
import { unknown } from "zod"

const bus2context = createContext({
    bus: "",
    setBus: unknown as React.Dispatch<React.SetStateAction<string>>,
    direction: 0,
    setDirection: unknown as React.Dispatch<React.SetStateAction<number>>,
    stationName: "",
    setStationName: unknown as React.Dispatch<React.SetStateAction<string>>,
    routeDetail: null as null | BusRouteType[],
    setRouteDetail: unknown as React.Dispatch<React.SetStateAction<BusRouteType[] | null>>,
})

export function BusProvider({children}: {children: React.ReactNode}) {
    const [bus, setBus] = useState("")
    const [direction, setDirection] = useState(0)
    const [stationName, setStationName] = useState("")

    return (
        <bus2context.Provider value={{
            bus,
            setBus,
            direction,
            setDirection,
            stationName,
            setStationName,
            routeDetail: null,
            setRouteDetail: unknown as React.Dispatch<React.SetStateAction<BusRouteType[] | null>>,
        }}>
            {children}
        </bus2context.Provider>
    )
}

export const useBus = () => useContext(bus2context).bus
export const useSetBus = () => useContext(bus2context).setBus
export const useDirection = () => useContext(bus2context).direction
export const useSetDirection = () => useContext(bus2context).setDirection
export const useRouteDetail = () => useContext(bus2context).routeDetail
export const useSetRouteDetail = () => useContext(bus2context).setRouteDetail