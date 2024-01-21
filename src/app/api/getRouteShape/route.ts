import { get_access_token } from "@/lib/TRX_get_access_token";
import type { BusRouteShapeType, BusShapePost } from "@/type/BusShape";
import axios from "axios";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, _res: NextResponse) {
    
    const postReq = await req.json() as BusShapePost;
    const access_token = (await get_access_token())["access_token"]
    const regex = /[A-Za-z]/g
    const {data}: {data: BusRouteShapeType[]} = (await axios.get(`https://tdx.transportdata.tw/api/basic/v2/Bus/Shape/City/Taichung?$format=JSON&$filter=contains(RouteName/Zh_tw,'${postReq.RouteName.replace(regex, "")}')`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }))

    return NextResponse.json(data.filter(item => item.RouteName.Zh_tw === postReq.RouteName && item.Direction === postReq.Direction)[0])
}