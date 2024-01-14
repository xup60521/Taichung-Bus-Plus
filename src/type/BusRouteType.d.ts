
export type BusRouteType = {
    RouteUID:   string;
    RouteID:    string;
    RouteName:  Name;
    Direction:  number;
    Stops:      Stop[];
    UpdateTime: string;
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
    open?:        boolean;
}

export type StopPosition = {
    PositionLon: number;
    PositionLat: number;
    GeoHash:     string;
}
