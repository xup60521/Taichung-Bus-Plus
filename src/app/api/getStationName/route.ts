import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { stopList } from "@/lib/stopList";

type StationNameType = {
    "StationName": {
        "Zh_tw":string
    }
}

export async function GET(req: NextRequest, _res: NextResponse) {
    const searchParam = req.nextUrl.searchParams.get("search") ?? ""
    return NextResponse.json({
        "stopList": stopList.filter(item=>item.StationName.Zh_tw.includes(searchParam))
    })
}