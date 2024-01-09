import type { AppRouter } from "@/server";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";


export const serverClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api/trpc"
        })
    ]
})