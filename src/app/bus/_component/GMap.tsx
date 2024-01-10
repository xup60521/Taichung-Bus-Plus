'use client'

import { publicENV } from "@/lib/publicENV"
import { APIProvider, Map } from "@vis.gl/react-google-maps"
import { useEffect, useState } from "react";

export default function GMap() {

    const [position, setPosition] = useState({ lat: 24.137396608878987, lng: 120.68692065044608 });

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

    return  (
    <APIProvider apiKey={publicENV.NEXT_PUBLIC_Google_Map_API_Key??""}>
        <Map
        zoom={11.5}
        center={position}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        />
    </APIProvider>)
}