import { z } from 'zod';
import { procedure, router } from './trpc';
import axios from "axios"
import { get_access_token } from '@/lib/TRX_get_access_token';
import { BusRouteEstType } from '@/type/BusRouteEstType';
import { AllBusType } from '@/type/AllBusType';
import { BusRouteType } from '@/type/BusRouteType';
import { AllStationType } from '@/type/AllStationType';

export const appRouter = router({
    getAllBusAllStation: procedure.query(async()=>{
        const access_token = (await get_access_token())["access_token"]
        const initBusData = (await axios.get(
            "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taichung/",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )).data as AllBusType[]
        const initAllStation = (await axios.get(
            `https://tdx.transportdata.tw/api/basic/v2/Bus/Station/City/Taichung?$select=StationName`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })).data as AllStationType[]
        return {
            initBusData,
            initAllStation
        }
        }),
    getBusRoute: procedure.input(z.string()).query(async(routeName)=>{
        
        const access_token = (await get_access_token())["access_token"]
        const route = await axios.get(
            `https://tdx.transportdata.tw/api/basic/v2/Bus/DisplayStopOfRoute/City/Taichung/${routeName.input}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        return route.data as BusRouteType[]
    }),
    getRouteArrivalEst: procedure.input(z.string()).query(async(routeName)=>{
        const access_token = (await get_access_token())["access_token"]
        const BusRouteEst = await axios.get(
            `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/Taichung/${routeName.input}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        return BusRouteEst.data as BusRouteEstType[]
    }),
    getAllStation: procedure.query(async()=>{
        const access_token = (await get_access_token())["access_token"]
        const allStation = await axios.get(
            `https://tdx.transportdata.tw/api/basic/v2/Bus/Station/City/Taichung?$select=StationName,StationPosition`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        return allStation.data as AllStationType[]
    })
})

// export type definition of API
export type AppRouter = typeof appRouter;