import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PointDTO, PointRequest, PointResponse} from '../models/point.model';

@Injectable({
    providedIn: 'root'
})
export class PointService {
    private apiUrl = '/api/points';

    constructor(private http: HttpClient) {
    }

    checkPoint(request: PointRequest): Observable<PointResponse> {
        return this.http.post<PointResponse>(`${this.apiUrl}/check`, request);
    }

    getAllPoints(): Observable<PointResponse[]> {
        return this.http.get<PointResponse[]>(`${this.apiUrl}/all`);
    }

    getCanvasPoints(): Observable<PointDTO[]> {
        return this.http.get<PointDTO[]>(`${this.apiUrl}/canvas`);
    }

    clearAllPoints(): Observable<any> {
        return this.http.delete(`${this.apiUrl}/clear`);
    }
}
