import { z } from "zod";

const envSchema = z.object({
    Next_Public_Site_URL: z.string()
})

type Env = z.infer<typeof envSchema>

export const publicENV = {
    Next_Public_Site_URL: process.env.Next_Public_Site_URL?? "",
}

envSchema.parse(publicENV)