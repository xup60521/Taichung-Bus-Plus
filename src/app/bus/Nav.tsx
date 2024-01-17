'use client'

import type { AllBusType } from "@/type/AllBusType";
import { FaBus, FaMapSigns, FaSign, } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Bus from "./_component/Bus";
import { useBus, useDirection, usePage, usePosition, useSetBus, useSetDirection, useSetPage, useSetRouteDetail, useSetStationName, useStationName } from "@/utils/BusContext";
import { useEffect, useRef, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { publicENV } from "@/lib/publicENV";
import StopsMarker from "./_component/Bus/StopsMaker";
import { useRouter, useSearchParams } from "next/navigation";
import BusStop from "./_component/BusStop";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { trpc } from "../_trpc/client";
import BusList from "./_component/BusList";
import Popup from "reactjs-popup"
import Spinner from "../_components/Spinner";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator"


export default function Nav({initBusData}: 
    {initBusData: AllBusType[]}) {

    const bus = useBus()
    const setBus = useSetBus()
    const position = usePosition()
    const stationName = useStationName()
    const setStationName = useSetStationName()
    const searchparams = useSearchParams()
    const direction = useDirection()
    const setDirection = useSetDirection()
    const setRouteDetail = useSetRouteDetail()
    const router = useRouter()
    const page = usePage()
    const setPage = useSetPage()
    const [openPopup, setOpenPopup] = useState(false)
    const [loading, setLoading] = useState(true)
    const routeDetail = trpc.getBusRoute.useQuery(bus , {
        enabled: Boolean(bus ?? ""),
        onSuccess: (data) => {
            setRouteDetail([...data])
        }        
    }).data

    const keyDownHandler = (e:KeyboardEvent) => {
        if (e.ctrlKey && e.key === "k") {
            e.preventDefault()
            setOpenPopup(true)
        }
    }

    useEffect(()=>{
        const sBus = searchparams.get("route")
        const sPage = searchparams.get("page")
        const sStationName = searchparams.get("stationName")
        const sDirection = searchparams.get("direction")
        if (sBus) {
            setBus(sBus.toUpperCase())
        }
        if (sPage) {
            setPage(sPage)
        } else {setPage("bus")}
        if (sStationName) {
            setStationName(sStationName)
        }
        if (sDirection) {
            setDirection(Number(sDirection))
        }
        setLoading(false)
    },[])
    
    useEffect(()=>{
        if (!loading) {
            router.push(`?page=${page}&route=${bus}&stationName=${stationName}&direction=${direction}`, {
                scroll: false        
            })
            const params = new URLSearchParams(searchparams.toString())
            window.history.pushState(null, '', `?${params.toString()}`)
        }
        }, [bus, page,stationName, direction])

    useEffect(()=>{
        window.addEventListener("keydown", keyDownHandler);
        return () => {
            window.removeEventListener("keydown", keyDownHandler);
  };
    })

    if (typeof window === "undefined") {
        return <div>browser window is not ready</div>
    }
    
    return (
        <>
            <div className={`w-full h-screen box-border flex bg-gradient-to-b from-rose-100 to-teal-100 overflow-hidden ${openPopup ? " blur-sm" : ""} transition-all`}>
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={2}>
                        <div className="h-full w-full bg-white flex flex-col justify-center items-center gap-2">
                            <button onClick={()=>{
                                if (page==="bus") {
                                    setPage("")
                                } else {
                                    setPage("bus")
                                }
                            }}  className={`${page === "bus" ? "bg-slate-200" : ""} flex justify-center items-center p-2 hover:bg-slate-200`}><FaBus /></button>
                            <button onClick={()=>{
                                if (page==="bus_stop") {
                                    setPage("")
                                } else {
                                    setPage("bus_stop")
                                }
                                }} className={`${page === "bus_stop" ? "bg-slate-200" : ""} flex justify-center items-center p-2 hover:bg-slate-200`} ><FaSign /></button>
                            <button onClick={()=>{
                            if (page==="bus_list") {
                                setPage("")
                            } else {
                                setPage("bus_list")                            }
                            }} className={`${page === "bus_list" ? "bg-slate-200" : ""} flex justify-center items-center p-2 hover:bg-slate-200`} ><FaMapSigns /></button>
                            <button onClick={()=>setOpenPopup(true)} className="flex justify-center items-center p-2 hover:bg-slate-200"><FaMagnifyingGlass /></button>
                        </div>                          
                    </ResizablePanel>
                    {(()=>{
                        if (page) {
                            return (
                                <>
                                    <ResizableHandle className="w-1" />
                                    <ResizablePanel defaultSize={25}>
                                        <div className="h-full w-full flex-grow overflow-x-hidden">
                                            {(()=>{
                                                if (page === "bus") {
                                                    return <Bus initBusData={initBusData} routeDetail={routeDetail} />
                                                }
                                                if (page === "bus_stop") {
                                                    return <BusStop />
                                                }
                                                if (page==="bus_list") {
                                                    return <BusList />
                                                }
                                                return ""
                                            })()}
                                        </div>
                                    </ResizablePanel>
                                </>
                            )
                        }
                    })()}
                    <ResizableHandle className="w-1.5" />
                    <ResizablePanel>
                        <div className="h-screen w-full">
                            <APIProvider apiKey={publicENV.NEXT_PUBLIC_Google_Map_API_Key??""}>
                                <Map
                                zoom={11.5}
                                center={position}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                                mapId={publicENV.NEXT_PUBLIC_Google_Map_ID}
                                >
                                <StopsMarker />   
                                </Map>
                            </APIProvider>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            <Popup open={openPopup} onClose={()=>setOpenPopup(false)}>
                <SearchResult setStationName={setStationName} setPage={setPage} setOpenPopup={setOpenPopup}  />
            </Popup>
        </>
    )
}

type SearchResultType = {
    "stopList": {
        "StationName": {
            "Zh_tw":string
        }
    }[]
}

function SearchResult({setStationName, setPage, setOpenPopup}: 
    {setStationName: React.Dispatch<React.SetStateAction<string>>, setPage: React.Dispatch<React.SetStateAction<string>>, setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>}) {

    const [statues, setStatus] = useState<"" | "loading" | "success">("")
    const [searchResult , setSearchResult] = useState<SearchResultType | null>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const handleSearch = async () => {
        if (!searchRef.current?.value) {
            toast({
                title: "請輸入搜尋關鍵字"
            })
            return
        }
        setStatus("loading")
        searchRef.current.disabled = true
        const {data}: {data: SearchResultType} = (await axios.get(`/api/getStationName?search=${searchRef.current.value}`))
        setSearchResult({...data})
        searchRef.current.disabled = false
        setStatus("success")
    }

    return (
        <div className="bg-white text-black max-w-96 w-[calc(100vw-5rem)] flex flex-col justify-center items-center rounded-lg p-4 gap-3">
            <h3 className=" text-xl my-2 font-bold">搜尋站牌</h3>
            <div className="w-full h-fit flex justify-center items-center box-border gap-2">
                <input onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        handleSearch()
                    }
                }} ref={searchRef} type="text" className="p-1 pl-2 flex-grow min-w-0 rounded-md border-2" />
                <button onClick={handleSearch} className="h-full flex justify-center items-center box-border border-2 rounded-md p-2  border-blue-500 text-blue-700 hover:bg-blue-500 hover:text-white transition-all"><FaMagnifyingGlass /></button>
            </div>
            {(()=>{
                if (statues === "loading") {
                    return <div className="w-full p-4 flex justify-center items-center">
                        <Spinner />
                    </div>
                }
                if (statues === "success" && searchResult) {
                    return <div className="w-full flex flex-col justify-center items-center h-fit ">
                        {!searchResult.stopList.length ? <div className="w-full h-12 text-center flex justify-center items-center">No Result</div> : ""}
                        <ScrollArea className="w-full max-h-[calc(100vh-10rem)] overflow-y-scroll">
                            {[...new Set(searchResult.stopList.map(d=>d.StationName.Zh_tw))].sort((a,b)=>a.length-b.length).map(item=>{
                                return (
                                    <>
                                        <button key={item} onClick={()=>{
                                            setStationName(item)
                                            setPage("bus_stop")
                                            setOpenPopup(false)
                                        }} className="w-full text-black rounded hover:bg-slate-100 cursor-pointer box-border p-2 font-bold text-left">
                                            {item}
                                        </button>
                                        <Separator />
                                    </>
                                )
                            })}
                        </ScrollArea>
                    </div>
                }
            })()}
        </div>
    )
}