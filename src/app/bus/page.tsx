
import { AllBusType } from "@/type/AllBusType"
import { serverClient } from "../_trpc/serverClient"
import Bus from "./_component/Bus"
import { BusProvider } from "@/utils/BusContext"
import Nav from "./Nav"
import dynamic from "next/dynamic"
import NoSSR from "react-no-ssr"

const DC = dynamic(()=>import("./Nav"), {ssr:false})

export default async function Page() {

    const initBusData = await serverClient.getAllBus.query()
    
    return (
        <BusProvider>
                <DC initBusData={initBusData}  />
        </BusProvider>
    )
}