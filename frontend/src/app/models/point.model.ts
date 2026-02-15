export interface PointRequest {
    x: number;
    y: number;
    r: number;
}

export interface PointResponse {
    id: number;
    x: number;
    y: number;
    r: number;
    hit: boolean;
    calcTime: number;
    releaseTime: string;
}

export interface PointDTO {
    x: number;
    y: number;
}
