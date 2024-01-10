import { serverClient } from "../_trpc/serverClient"
import Bus from "./Bus"

export default async function Page() {

    const data = await serverClient.getAllBus.query() 

    return (
        <>
            <Bus initData={data} />
        </>
    )
}