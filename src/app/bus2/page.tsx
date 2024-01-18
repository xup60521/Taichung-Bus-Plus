'use client'

import { MapContainer, TileLayer } from "react-leaflet"
import Spinner from "../_components/Spinner"
import "leaflet/dist/leaflet.css"


export default function Bus2() {

    return (
        <div className="">
            {/* <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className="w-screen h-screen">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            </MapContainer> */}
        </div>
    )
}

