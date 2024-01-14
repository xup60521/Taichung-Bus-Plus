'use client'

import { AllStationType } from "@/type/AllStationType"
import { useSetStation } from "@/utils/BusContext"
import { useId } from "react"
import Select from "react-select"


export default function BusStop() {

    const setStation = useSetStation()
    // const selectOptions = initAllStation?.map((d)=>{
    //     return {
    //         label: d.StationName.Zh_tw,
    //         value: d.StationName.Zh_tw,
    //     }
    // })
    
    return (
        <>
            <div className=" w-full h-full box-border text-black overflow-x-hidden flex flex-col justify-center items-center z-20">
                <div className="flex h-full w-full">
                    <div className="bg-white bg-opacity-50 backdrop-blur-lg  w-full h-full p-4 flex flex-col items-center gap-4">
                        <p className="font-black text-lg">站牌</p>
                    </div>
                </div>
            </div>
        </>
    )
}