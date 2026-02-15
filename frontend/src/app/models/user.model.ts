export interface User {
    username: string;
    groupNumber: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    username: string;
    groupNumber: string;
    token: string;
    message?: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    groupNumber: string;
}
