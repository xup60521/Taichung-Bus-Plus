export type AllBusType = {
    status:              string;
    fetchStatus:         string;
    isLoading:           boolean;
    isSuccess:           boolean;
    isError:             boolean;
    isInitialLoading:    boolean;
    data:                Datum[];
    dataUpdatedAt:       number;
    error:               null;
    errorUpdatedAt:      number;
    failureCount:        number;
    failureReason:       null;
    errorUpdateCount:    number;
    isFetched:           boolean;
    isFetchedAfterMount: boolean;
    isFetching:          boolean;
    isRefetching:        boolean;
    isLoadingError:      boolean;
    isPaused:            boolean;
    isPlaceholderData:   boolean;
    isPreviousData:      boolean;
    isRefetchError:      boolean;
    isStale:             boolean;
    trpc:                Trpc;
}

export type Datum = {
    RouteUID:              string;
    RouteID:               string;
    HasSubRoutes:          boolean;
    Operators:             Operator[];
    AuthorityID:           string;
    ProviderID:            string;
    SubRoutes:             SubRoute[];
    BusRouteType:          number;
    RouteName:             Name;
    DepartureStopNameZh:   string;
    DepartureStopNameEn:   string;
    DestinationStopNameZh: string;
    DestinationStopNameEn: string;
    RouteMapImageUrl?:     string;
    City:                  City;
    CityCode:              CityCode;
    UpdateTime:            Date;
    VersionID:             number;
}

export enum City {
    Taichung = "Taichung",
}

export enum CityCode {
    Txg = "TXG",
}

export type Operator = {
    OperatorID:    string;
    OperatorName:  Name;
    OperatorCode?: OperatorCode;
    OperatorNo?:   string;
}

export enum OperatorCode {
    AllDayBus = "AllDayBus",
    CenterTaiwanBus = "CenterTaiwanBus",
    ChuanHangBus = "ChuanHangBus",
    ChungluBus = "ChungluBus",
    Empty = "",
    FengyuanBus = "FengyuanBus",
    GeyaBus = "GeyaBus",
    HoHsinBus = "HoHsinBus",
    JasunBus = "JasunBus",
    JianMingBus = "JianMingBus",
    KuoKuangBus = "KuoKuangBus",
    MiaoliBus = "MiaoliBus",
    SiFangBus = "SiFangBus",
    SoutheastBus = "SoutheastBus",
    TaichungBus = "TaichungBus",
    UnitedHighwayBus = "UnitedHighwayBus",
}

export type Name = {
    Zh_tw: string;
    En?:   string;
}

export type SubRoute = {
    SubRouteUID:  string;
    SubRouteID:   string;
    OperatorIDs:  string[];
    SubRouteName: Name;
    Headsign:     string;
    Direction:    number;
}

export type Trpc = {
    path: string;
}
