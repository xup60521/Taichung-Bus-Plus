export type BusRouteType = {
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
    RouteUID:   string;
    RouteID:    string;
    RouteName:  Name;
    Direction:  number;
    Stops:      Stop[];
    UpdateTime: Date;
    VersionID:  number;
}

export type Name = {
    Zh_tw: string;
    En:    string;
}

export type Stop = {
    StopUID:      string;
    StopID:       string;
    StopName:     Name;
    StopBoarding: number;
    StopSequence: number;
    StopPosition: StopPosition;
    StationID:    string;
}

export type StopPosition = {
    PositionLon: number;
    PositionLat: number;
    GeoHash:     string;
}
