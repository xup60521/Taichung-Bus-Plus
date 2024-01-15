
export type AllBusType = {
    // RouteUID:              string;
    // RouteID:               string;
    // HasSubRoutes:          boolean;
    // Operators:             Operator[];
    // AuthorityID:           string;
    // ProviderID:            string;
    SubRoutes:             SubRoute[];
    // BusRouteType:          number;
    RouteName:             Name;
    // DepartureStopNameZh:   string;
    // DepartureStopNameEn:   string;
    // DestinationStopNameZh: string;
    // DestinationStopNameEn: string;
    // RouteMapImageUrl?:     string;
    // City:                  City;
    // CityCode:              CityCode;
    // UpdateTime:            string;
    // VersionID:             number;
}

type Name = {
    Zh_tw: string;
    En?:   string;
}

type SubRoute = {
    SubRouteUID:  string;
    SubRouteID:   string;
    OperatorIDs:  string[];
    SubRouteName: Name;
    Headsign:     string;
    Direction:    number;
}

// enum City {
//     Taichung = "Taichung",
// }

// enum CityCode {
//     Txg = "TXG",
// }

// type Operator = {
//     OperatorID:    string;
//     OperatorName:  Name;
//     OperatorCode?: OperatorCode;
//     OperatorNo?:   string;
// }

// enum OperatorCode {
//     AllDayBus = "AllDayBus",
//     CenterTaiwanBus = "CenterTaiwanBus",
//     ChuanHangBus = "ChuanHangBus",
//     ChungluBus = "ChungluBus",
//     Empty = "",
//     FengyuanBus = "FengyuanBus",
//     GeyaBus = "GeyaBus",
//     HoHsinBus = "HoHsinBus",
//     JasunBus = "JasunBus",
//     JianMingBus = "JianMingBus",
//     KuoKuangBus = "KuoKuangBus",
//     MiaoliBus = "MiaoliBus",
//     SiFangBus = "SiFangBus",
//     SoutheastBus = "SoutheastBus",
//     TaichungBus = "TaichungBus",
//     UnitedHighwayBus = "UnitedHighwayBus",
// }


