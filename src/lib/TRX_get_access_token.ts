import axios from "axios"
import { env } from "./env"
import { log } from "console"

export async function get_access_token() {
    try {
        const res = await axios.post(
            "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token",
            {
                grant_type: "client_credentials",
                client_id: env.client_id,
                client_secret: env.client_secret
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )
        return res.data
    } catch(err) {
        log(err)
    }
}