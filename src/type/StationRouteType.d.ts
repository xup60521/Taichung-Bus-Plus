export type StationRouteType = {
    StationUID:       string;
    StationID:        string;
    StationName:      StationName;
    StationPosition:  StationPosition;
    StationGroupID:   string;
    Stops:            Stop[];
    LocationCityCode: string;
    Bearing:          string;
    UpdateTime:       string;
    VersionID:        number;
}

export type StationName = {
    Zh_tw: string;
}

export type StationPosition = {
    PositionLon: number;
    PositionLat: number;
    GeoHash:     string;
}

export type Stop = {
    StopUID:   string;
    StopID:    string;
    StopName:  Name;
    RouteUID:  string;
    RouteID:   string;
    RouteName: Name;
}

export type Name = {
    Zh_tw: string;
    En:    string;
}

