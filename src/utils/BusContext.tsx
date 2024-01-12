'use client'

import  { createContext, useContext, useEffect, useState } from "react";
import type React from "react"
import { unknown } from "zod";

const BusContext = createContext({
    position: {lat: 24.137396608878987, lng: 120.68692065044608},
    bus: "",
    setBus: unknown as React.Dispatch<React.SetStateAction<string>>,
    direction: 0,
    setDirection: unknown as React.Dispatch<React.SetStateAction<number>>
})

export function BusProvider({children}: {children: React.ReactNode}) {
    
    const [bus, setBus] = useState("")
    const [position, setPosition] = useState({ lat: 24.137396608878987, lng: 120.68692065044608 });
    const [direction, setDirection] = useState(0)
    
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
        <BusContext.Provider value={{bus, setBus, position, direction, setDirection}}>
            {children}
        </BusContext.Provider>
    )
}

export const useBus = () => useContext(BusContext).bus
export const useSetBus = () => useContext(BusContext).setBus
export const usePosition = () => useContext(BusContext).position
export const useDirection = () => useContext(BusContext).direction
export const useSetDirection = () => useContext(BusContext).setDirection