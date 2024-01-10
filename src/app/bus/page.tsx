import { AllBusType } from "@/type/AllBusType"
import { serverClient } from "../_trpc/serverClient"
import Bus from "./Bus"

export default async function Page() {

    const data = await serverClient.getAllBus.query() as AllBusType["data"]
    
    return (
        <>
            <Bus initData={data} />
        </>
    )
}