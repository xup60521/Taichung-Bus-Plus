'use client'

import { useBus, useBusShape, useDirection, useRouteDetail, useStayOnRouteDetails, useStationName } from "@/utils/BusContext"
import seedrandom from "seedrandom"
import MapMarker from "./MapMarker"
import NoSSR from "react-no-ssr"
import { Marker, Polyline, Tooltip } from "react-leaflet"
import { Icon } from "leaflet"

export default function DisplayMarkers() {
    const routeDetail = useRouteDetail()
    const direction = useDirection()
    const bus = useBus()
    const stayOnRouteDetails = useStayOnRouteDetails()
    const busShape = useBusShape()
    if (!Array.isArray(routeDetail) || routeDetail.length === 0) {
        return ""
    }

    const isOneWay = (routeDetail.filter((item)=>item.RouteName.Zh_tw === bus).length === 1) ? true : false
    let filteredData;
    if (isOneWay) {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw === bus)[0].Stops
    } else {
        filteredData = routeDetail.filter((item)=>item.RouteName.Zh_tw.toUpperCase() === bus.toUpperCase() && item.Direction === direction)[0]?.Stops
    }
    let headsign = ""
    if (filteredData) {
        headsign = `${filteredData[0].StopName.Zh_tw} - ${filteredData.reverse()[0].StopName.Zh_tw}`
    }

    const bg_color = `rgb(${Math.floor(255*seedrandom(`${bus} ${direction} R`)())},${Math.floor(255*seedrandom(`${bus} ${direction} G`)())},${Math.floor(255*seedrandom(`${bus} ${direction} B`)())})`

    if (typeof window === "undefined") {
        return <div>browser window is not ready</div>
    }

    return (
        <NoSSR>
            {filteredData?.reverse().map((d)=>{
                if (typeof window !== "undefined") {
                    return <MapMarker headsign={headsign} bus={bus} bg_color={bg_color} key={d.StopSequence.toString()} d={d} />
                }
            })}
            {stayOnRouteDetails?.map((d, _i, arr)=>{
                const sign = `${d.Stops[0].StopName.Zh_tw} - ${d.Stops.at(-1)?.StopName.Zh_tw}`
                const color = `rgb(${Math.floor(255*seedrandom(`${d.RouteName.Zh_tw} ${d.Direction} R`)())},${Math.floor(255*seedrandom(`${d.RouteName.Zh_tw} ${d.Direction} G`)())},${Math.floor(255*seedrandom(`${d.RouteName.Zh_tw} ${d.Direction} B`)())})`
                return d.Stops.map(item=>{
                    const icon = new Icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828677.png",
                        iconSize: [12, 12],
                    })   
                     

                    if (typeof window !== "undefined") {
                        return (
                            <Marker key={`${item.StopName.Zh_tw} stop`} position={[item.StopPosition.PositionLat, item.StopPosition.PositionLon]} icon={icon} >
                            <Tooltip>
                                <div key={item.StopSequence.toString()+"infoElm"} className="">
                                    <p>{`${d.RouteName.Zh_tw} ${sign}`}</p>
                                    <p className="font-bold" >{`${item.StopSequence} ${item.StopName.Zh_tw}`}</p>
                                </div>
                            </Tooltip>
                        </Marker>)

                    }
                })
            })}
            {busShape?.map(d=>{
                const color = `rgb(${Math.floor(255*seedrandom(`${d.RouteName.Zh_tw} ${d.Direction} R`)())},${Math.floor(255*seedrandom(`${d.RouteName.Zh_tw} ${d.Direction} G`)())},${Math.floor(255*seedrandom(`${d.RouteName.Zh_tw} ${d.Direction} B`)())})`
                const regex = /[A-Za-z()]/g
                const position = d.Geometry.replace(regex, "").split(",").map(f=>f.split(" ").reverse().map(item=>Number(item))) as [number, number][]
                return <Polyline key={`${d.RouteName.Zh_tw} ${d.Direction} polyline`} pathOptions={{
                    color,
                    weight: 10
                }} positions={position} />
            })}
            {/* {(()=>{
                const str = "LINESTRING(120.68351 24.13898,120.68196 24.14037,120.67959 24.14246,120.68129 24.14413,120.68182 24.14463,120.68219 24.14535,120.68306 24.14727,120.68345 24.14833,120.68384 24.14928,120.68517 24.15241,120.68616 24.15467,120.68613 24.15474,120.68594 24.15467,120.68383 24.15383,120.68192 24.15310,120.67998 24.15235,120.67876 24.15187,120.67745 24.15139,120.67729 24.15126,120.67735 24.15248,120.67736 24.15463,120.67673 24.15662,120.67587 24.15923,120.67287 24.15923,120.66769 24.15925,120.66576 24.15919,120.66517 24.15899,120.66483 24.15881,120.66443 24.15842,120.66410 24.15796,120.66263 24.15572,120.65609 24.15924,120.65446 24.15668,120.65302 24.15453,120.65301 24.14533,120.65306 24.14215,120.65299 24.13891,120.65307 24.13629,120.65307 24.13498,120.65060 24.13487,120.64747 24.13477,120.64348 24.13479,120.64079 24.13488,120.63897 24.13505,120.63675 24.13579,120.63561 24.13290,120.63472 24.13063,120.63140 24.12513,120.63351 24.12863,120.62899 24.12116,120.62779 24.11838,120.62673 24.11593,120.62635 24.11469,120.62601 24.11357,120.62578 24.11098,120.62569 24.11050,120.62021 24.11113,120.61950 24.11026,120.61840 24.11163,120.61638 24.11190,120.61611 24.11010,120.61540 24.11018,120.61566 24.11400,120.61418 24.11416,120.61287 24.11555,120.61128 24.11424,120.60772 24.11208,120.60879 24.11510,120.60780 24.11866,120.60777 24.12064,120.60728 24.12232,120.60694 24.12362,120.60691 24.12485,120.60748 24.12645,120.60792 24.12747,120.60869 24.12845,120.60966 24.13044,120.61049 24.13170,120.61081 24.13231,120.61133 24.13405,120.61191 24.13614,120.61246 24.13847,120.60906 24.13853)"
                const regex = /[A-Z()]/g
                const arr = str.replace(regex, "").split(",").map(d=>d.split(" "))
                return <Polyline pathOptions={{
                    color: "purple",
                    fillColor: "purple"
                }} positions={arr} />
            })()} */}
        </NoSSR>
    )
}

