import { z } from 'zod';
import { procedure, router } from './trpc';
import axios from "axios"
import { get_access_token } from '@/lib/TRX_get_access_token';
import { BusRouteEstType } from '@/type/BusRouteEstType';
import { AllBusType } from '@/type/AllBusType';
import { BusRouteType } from '@/type/BusRouteType';
import { StationRouteType } from '@/type/StationRouteType';
import { log } from 'console';

export const appRouter = router({
    getAllBus: procedure.query(async()=>{
        const access_token = (await get_access_token())["access_token"]
        const allBus = await axios.get(
            "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taichung?$select=SubRoutes,RouteName",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        return allBus.data as AllBusType[]
        }),
    getBusRoute: procedure.input(z.string()).query(async(routeName)=>{
        const regex = /[A-Za-z]/
        const access_token = (await get_access_token())["access_token"]
        const route = await axios.get(
            `https://tdx.transportdata.tw/api/basic/v2/Bus/DisplayStopOfRoute/City/Taichung/${routeName.input.replace(regex, "")}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        return route.data as BusRouteType[]
    }),
    getRouteArrivalEst: procedure.input(z.string()).query(async(routeName)=>{
        const regex = /[A-Za-z]/g
        const access_token = (await get_access_token())["access_token"]
        let str = routeName.input
        str = str.replace(regex, "")
        const BusRouteEst = await axios.get(
            `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/Taichung/${str}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        return BusRouteEst.data as BusRouteEstType[]
    }),
    getStationRouteEst: procedure.input(z.string()).query(async(StationName)=>{
        const access_token = (await get_access_token())["access_token"]
        const StationRoute = await axios.get(
            `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/Taichung?$filter=StopName/Zh_tw eq '${StationName.input}'&$format=JSON`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        return StationRoute.data as BusRouteEstType[]
    }),
    
})

// export type definition of API
export type AppRouter = typeof appRouter;

