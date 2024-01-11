export type BusRouteEstType = {
  PlateNumb: string
  StopUID: string
  StopID: string
  StopName: StopName
  RouteUID: string
  RouteID: string
  RouteName: RouteName
  SubRouteUID: string
  SubRouteID: string
  SubRouteName: SubRouteName
  Direction: number
  EstimateTime?: number
  StopSequence: number
  StopStatus: number
  NextBusTime?: string
  Estimates?: Estimate[]
  SrcUpdateTime: string
  UpdateTime: string
}

export type StopName = {
  Zh_tw: string
  En: string
}

export type RouteName = {
  Zh_tw: string
  En: string
}

export type SubRouteName = {
  Zh_tw: string
  En: string
}

export type Estimate = {
  PlateNumb: string
  EstimateTime: number
  IsLastBus: boolean
  VehicleStopStatus?: number
}
