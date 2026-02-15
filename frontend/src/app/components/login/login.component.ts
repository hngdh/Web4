import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {LoginRequest} from '../../models/user.model';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [MessageService]
})
export class LoginComponent {
    credentials: LoginRequest = {
        username: '',
        password: ''
    };
    loading = false;
    showRegister = false;

    registerData = {
        username: '',
        password: '',
        groupNumber: ''
    };

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/main']);
        }
    }

    onLogin(): void {
        if (!this.credentials.username || !this.credentials.password) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter username and password'
            });
            return;
        }

        this.loading = true;
        this.authService.login(this.credentials).subscribe({
            next: () => {
                setTimeout(() => {
                    this.router.navigate(['/main']);
                }, 500);
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Invalid username or password'
                });
            }
        });
    }

    onRegister(): void {
        if (!this.registerData.username || !this.registerData.password || !this.registerData.groupNumber) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all fields'
            });
            return;
        }

        this.loading = true;
        this.authService.register(this.registerData).subscribe({
            next: () => {
                this.showRegister = false;
                this.credentials.username = this.registerData.username;
                this.credentials.password = this.registerData.password;
                this.registerData = {username: '', password: '', groupNumber: ''};
                this.onLogin();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Registration failed'
                });
            }
        });
    }

    toggleForm(): void {
        this.showRegister = !this.showRegister;
    }
}
