'use client'

import { BusRouteType } from "@/type/BusRouteType";
import  { createContext, useContext, useEffect, useState } from "react";
import type React from "react"
import { unknown } from "zod";

const BusContext = createContext({
    position: {lat: 24.137396608878987, lng: 120.68692065044608},
    bus: "",
    setBus: unknown as React.Dispatch<React.SetStateAction<string>>,
    direction: 0,
    setDirection: unknown as React.Dispatch<React.SetStateAction<number>>,
    station: "",
    setStation: unknown as React.Dispatch<React.SetStateAction<string>>,
    routeDetail: null as null | BusRouteType[],
    setRouteDetail: unknown as React.Dispatch<React.SetStateAction<BusRouteType[] | null>>,
    toggleShowStopInfo: {
        stopName: "",
        randomNumber: 0
    },
    setToggleShowStopInfo: unknown as React.Dispatch<React.SetStateAction<{
        stopName: string,
        randomNumber: number
    }>>,
    page: "",
    setPage: unknown as React.Dispatch<React.SetStateAction<string | "bus" | "bus_stop">>
})

export function BusProvider({children}: {children: React.ReactNode}) {
    
    const [bus, setBus] = useState("")
    const [position, setPosition] = useState({ lat: 24.137396608878987, lng: 120.68692065044608 });
    const [direction, setDirection] = useState(0)
    const [station, setStation] = useState("")
    const [routeDetail, setRouteDetail] = useState<BusRouteType[] | null>(null)
    const [toggleShowStopInfo, setToggleShowStopInfo] = useState({
        stopName: "",
        randomNumber: 0
    })
    const [page, setPage] = useState("")
    
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }
        }, []);
    
    return (
        <BusContext.Provider value={{
            bus, 
            setBus, 
            position,
            direction, 
            setDirection,
            station,
            setStation,
            routeDetail,
            setRouteDetail,
            toggleShowStopInfo,
            setToggleShowStopInfo,
            page,
            setPage
            }}>
            {children}
        </BusContext.Provider>
    )
}

export const useBus = () => useContext(BusContext).bus
export const useSetBus = () => useContext(BusContext).setBus
export const usePosition = () => useContext(BusContext).position
export const useDirection = () => useContext(BusContext).direction
export const useSetDirection = () => useContext(BusContext).setDirection
export const useStation = () => useContext(BusContext).station
export const useSetStation = () => useContext(BusContext).setStation
export const useRouteDetail = () => useContext(BusContext).routeDetail
export const useSetRouteDetail = () => useContext(BusContext).setRouteDetail
export const useToggleShowStopInfo = () => useContext(BusContext).toggleShowStopInfo
export const useSetToggleShowStopInfo = () => useContext(BusContext).setToggleShowStopInfo
export const usePage = () => useContext(BusContext).page
export const useSetPage = () => useContext(BusContext).setPage