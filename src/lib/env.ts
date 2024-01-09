import {z} from "zod"

const envSchema = z.object({
    "client_id": z.string(),
    "client_secret": z.string()
})

type Env = z.infer<typeof envSchema>

export const env = {
    "client_id": process.env.client_id?? "",
    "client_secret": process.env.client_secret ?? ""
}

envSchema.parse(env)