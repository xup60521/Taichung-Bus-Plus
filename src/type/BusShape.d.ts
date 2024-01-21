export type BusShapePost = {
    RouteName: string;
    Direction: number;
}

export type BusRouteShapeType = {
    RouteUID:        string;
    RouteID:         string;
    RouteName:       RouteName;
    SubRouteUID:     string;
    SubRouteID:      string;
    SubRouteName:    RouteName;
    Direction:       number;
    Geometry:        string;
    EncodedPolyline: string;
    UpdateTime:      Date;
    VersionID:       number;
}

export type RouteName = {
    Zh_tw: string;
    En:    string;
}