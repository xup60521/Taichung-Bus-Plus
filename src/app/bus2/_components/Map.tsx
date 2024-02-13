'use client'
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useState } from "react";

export default function Map() {

    const [position, setPosition] = useState({ lat: 24.137396608878987, lng: 120.68692065044608 });

    return (
        <MapContainer center={[position.lat, position.lng]} zoom={13} scrollWheelZoom={true} className="w-full h-full z-0" >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="absolute left-0"
            />
        </MapContainer>
    )
}