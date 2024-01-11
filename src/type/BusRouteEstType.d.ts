export type BusRouteEstType = {
    PlateNumb:     PlateNumb;
    StopUID:       string;
    StopID:        string;
    StopName:      Name;
    RouteUID:      RouteUid;
    RouteID:       string;
    RouteName:     Name;
    SubRouteUID:   RouteUid;
    SubRouteID:    string;
    SubRouteName:  Name;
    Direction:     number;
    EstimateTime?: number;
    StopSequence:  number;
    StopStatus:    number;
    NextBusTime:   Date;
    Estimates?:    Estimate[];
    SrcUpdateTime: Date;
    UpdateTime:    Date;
}

export type Estimate = {
    PlateNumb:    PlateNumb;
    EstimateTime: number;
    IsLastBus:    boolean;
}

export type PlateNumb = string;

export type Name = {
    Zh_tw: string;
    En:    string;
}

export type RouteUid = string;