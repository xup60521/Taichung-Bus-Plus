import { AllBusType } from "@/type/AllBusType"
import { serverClient } from "../_trpc/serverClient"
import Bus from "./_component/Bus"
import { BusProvider } from "@/utils/BusContext"
import Nav from "./Nav"

export default async function Page() {

    const data = await serverClient.getAllBus.query()
    
    return (
        <BusProvider>
            <Nav initData={data} />
        </BusProvider>
    )
}