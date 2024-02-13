import dynamic from "next/dynamic"
import { serverClient } from "../_trpc/serverClient"


const Bus = dynamic(()=> import('./Bus'), {ssr: false})

export default async function Bus2() {

    const initBusData = await serverClient.getAllBus.query()

    return (
        <div className="w-screen h-screen">
            <Bus />
        </div>
    )
}

