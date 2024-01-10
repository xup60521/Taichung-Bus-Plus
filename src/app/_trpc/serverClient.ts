import { publicENV } from "@/lib/publicENV";
import type { AppRouter } from "@/server";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";


export const serverClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: `${publicENV.Next_Public_Site_URL}/api/trpc`
        })
    ]
})