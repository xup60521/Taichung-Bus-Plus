'use client'

import { publicENV } from "@/lib/publicENV"
import type { Datum }  from "@/type/AllBusType" 
import type { BusRouteType } from "@/type/BusRouteType"
import type { Unpacked } from "@/type/TypeOperator"
import { trpc } from "../_trpc/client"
import { useEffect, useId, useState } from "react"
import { FaArrowRightLong } from "react-icons/fa6";
import {APIProvider, InfoWindow, Map,  useMarkerRef, Marker  } from '@vis.gl/react-google-maps';
import Select from "react-select"

export default function Bus({initData}: {initData: Datum[]}) {
    
   const [bus, setBus] = useState("")
   const routeDetail = trpc.getBusRoute.useQuery(bus ?? "") as BusRouteType
   const [order, setOrder] = useState(0)
   const [position, setPosition] = useState({ lat: 24.137396608878987, lng: 120.68692065044608 });
   const selectOptions = initData.map(d=>{
    return {
        "value": d.RouteName.Zh_tw,
        "label": d.RouteName.Zh_tw,
        "key": d.RouteName.Zh_tw,
    }
   })
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
                        <Select onChange={(e)=>setBus(e?.value ?? "")} options={selectOptions} instanceId={useId()} className="text-black w-full" />
                        <div>
                            {!isOneWay && <button onClick={()=>{
                                setOrder((prev)=>{
                                    if (prev === 1) {return 0}
                                    return 1
                                })
                            }}>Change Direction</button>}
                        </div>
                        <StopList routeDetail={routeDetail} direction={order} bus={bus} />                    
                    </div>
                </div>
                <div className="absolute h-screen w-screen z-10">
                    <APIProvider apiKey={publicENV.NEXT_PUBLIC_Google_Map_API_Key??""}>
                        <Map
                        zoom={11.5}
                        center={position}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                        >
                            <StopsMarker routeDetail={routeDetail} direction={order} bus={bus} />   
                        </Map>
                    </APIProvider>
                </div>
            </div>
        </>
    )
}

function StopList({routeDetail, direction, bus}: {routeDetail: BusRouteType, direction: number, bus:string}) {
    if (!Array.isArray(routeDetail.data)) {
        return ""
    }
    const isOneWay = (routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    let filteredData;
    if (isOneWay) {
        filteredData = routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus)[0].Stops
    } else {
        filteredData = routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus && item.Direction === direction)[0].Stops
    }
    

    return (
        <>
            <div className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 font-bold border-2 rounded-md p-2 w-full">
                <span className="w-2/5 text-center">{filteredData[0].StopName.Zh_tw}</span>
                <span className="w-1/5 flex justify-center "><FaArrowRightLong /></span>
                <span className="w-2/5 text-center">{filteredData.reverse()[0].StopName.Zh_tw}</span>
            </div>
            <div className=" flex-grow w-full overflow-y-auto flex flex-col gap-2">
                {filteredData.reverse().map(d=>{
                    return (
                        <div key={d.StopName.Zh_tw}>
                            <span className="text-xl">{d.StopName.Zh_tw}</span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

function StopsMarker({routeDetail, direction, bus}: {routeDetail: BusRouteType, direction: number, bus:string}) {
    if (!Array.isArray(routeDetail.data)) {
        return ""
    }
    const isOneWay = (routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    let filteredData;
    if (isOneWay) {
        filteredData = routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus)[0].Stops
    } else {
        filteredData = routeDetail.data.filter((item)=>item.RouteName.Zh_tw === bus && item.Direction === direction)[0].Stops
    }

    return (
        <>
            {filteredData.reverse().map((d)=>{
                return <DisplayMaker  key={d.StopSequence.toString()} d={d} />
            })}
        </>
    )
}

function DisplayMaker({d}:{d: Unpacked<Unpacked<BusRouteType["data"]>["Stops"]>}) {
    const [markerRef, marker] = useMarkerRef();
    const [open, setOpen] = useState(false)
    
    return (
        <>
            <Marker ref={markerRef} position={{lat: d.StopPosition.PositionLat, lng: d.StopPosition.PositionLon}}
                        title={d.StopName.Zh_tw} onClick={()=>setOpen(prev=>!prev)}  />
            {open && <InfoWindow anchor={marker} key={d.StopSequence.toString()+"info"} onCloseClick={()=>setOpen(false)} >
                        <div key={d.StopSequence.toString()+"infoElm"} className="">
                            <p className="font-bold" >{`${d.StopSequence} ${d.StopName.Zh_tw}`}</p>
                        </div>
                    </InfoWindow>}
        </>
    )
}