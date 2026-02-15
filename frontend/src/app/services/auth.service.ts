import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {LoginRequest, LoginResponse, RegisterRequest, User} from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public currentUser: Observable<User | null>;
    private apiUrl = '/api/auth';
    private currentUserSubject: BehaviorSubject<User | null>;

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(
            savedUser ? JSON.parse(savedUser) : null
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public get token(): string | null {
        return localStorage.getItem('token');
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
            .pipe(
                tap(response => {
                    if (response.token) {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('currentUser', JSON.stringify({
                            username: response.username,
                            groupNumber: response.groupNumber
                        }));
                        this.currentUserSubject.next({
                            username: response.username,
                            groupNumber: response.groupNumber
                        });
                    }
                })
            );
    }

    register(request: RegisterRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, request);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.token && !!this.currentUserValue;
    }
}
