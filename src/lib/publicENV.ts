import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_Site_URL: z.string(),
    NEXT_PUBLIC_Google_Map_API_Key: z.string(),
    NEXT_PUBLIC_Google_Map_ID: z.string()
})

type Env = z.infer<typeof envSchema>

export const publicENV:Env = {
    NEXT_PUBLIC_Site_URL: process.env.NEXT_PUBLIC_Site_URL?? "",
    NEXT_PUBLIC_Google_Map_API_Key: process.env.NEXT_PUBLIC_Google_Map_API_Key ?? "",
    NEXT_PUBLIC_Google_Map_ID: process.env.NEXT_PUBLIC_Google_Map_ID ?? ""
}

envSchema.parse(publicENV)