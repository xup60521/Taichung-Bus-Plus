'use client'

import { publicENV } from "@/lib/publicENV"
import type { AllBusType }  from "@/type/AllBusType" 
import { trpc } from "../_trpc/client"
import { useEffect, useId, useState } from "react"
import {APIProvider, Map  } from '@vis.gl/react-google-maps';
import Select from "react-select"
import StopList from "./_component/StopList"
import StopsMarker from "./_component/StopsMaker"

export default function Bus({initData}: {initData: AllBusType[]}) {
    
    const [order, setOrder] = useState(0)
    const [position, setPosition] = useState({ lat: 24.137396608878987, lng: 120.68692065044608 });
    const [bus, setBus] = useState("")
    const routeDetail = trpc.getBusRoute.useQuery(bus , {
        enabled: Boolean(bus ?? "")
    })
    
    
    const regex1 = /^[\u4e00-\u9fa5]/
    const regex2 = /[\u4e00-\u9fa5][0-9]/
    const regex3 = /[\u4e00-\u9fa5A-Z()]/g
    const selectOptions = initData.map(d=>{
    return {
        "value": d.RouteName.Zh_tw,
        "label": `${d.RouteName.Zh_tw} ${d.SubRoutes[0].Headsign}`,
    }}).sort((a,b)=>Number(a.value.replace(regex1, "").replace(regex2, "").replace(regex3, "")) - Number(b.value.replace(regex1, "").replace(regex2, "").replace(regex3, "")))
    let isOneWay = false;
    if (Array.isArray(routeDetail.data)) {
        isOneWay = (routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    }

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
        <>
            <div className=" w-screen h-screen text-black overflow-x-hidden flex flex-col justify-center items-center z-20">
                <div className="flex h-full w-full">
                    <div className="bg-white bg-opacity-50 backdrop-blur-lg  w-96 h-full p-4 flex flex-col items-center gap-4 z-50">
                        <p className="font-black text-lg">---選擇路線---</p>
                        <Select onChange={(e)=>{
                            setBus(e?.value ?? "")                            
                        }} options={selectOptions} instanceId={useId()} className="text-black w-full" />
                        {Boolean(bus) && <>
                            <div>
                                {!isOneWay && <button onClick={()=>{
                                    if (order === 1) {setOrder(0)} 
                                    else {setOrder(1)}
                                }}>Change Direction</button>}
                            </div>
                            {routeDetail.isSuccess && <StopList routeDetail={routeDetail.data} direction={order} bus={bus} />}
                        </>}                         
                    </div>
                </div>
                <div className="absolute h-screen w-screen z-10">
                    <APIProvider apiKey={publicENV.NEXT_PUBLIC_Google_Map_API_Key??""}>
                        <Map
                        zoom={11.5}
                        center={position}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                        mapId={publicENV.NEXT_PUBLIC_Google_Map_ID}
                        >
                            <StopsMarker routeDetail={routeDetail.data} direction={order} bus={bus} />   
                        </Map>
                    </APIProvider>
                </div>
            </div>
        </>
    )
}