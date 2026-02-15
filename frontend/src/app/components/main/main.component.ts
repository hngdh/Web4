import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {PointService} from '../../services/point.service';
import {PointDTO, PointRequest, PointResponse} from '../../models/point.model';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
    providers: [MessageService]
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('canvas', {static: false}) canvasRef!: ElementRef<HTMLCanvasElement>;
    x = 0;
    y = 0;
    r = 1;

    canvasX = 0;
    canvasY = 0;

    sliderX = 0;
    sliderY = 0;

    points: PointResponse[] = [];
    canvasPoints: PointDTO[] = [];
    loading = false;

    username = '';
    groupNumber = '';
    private ctx!: CanvasRenderingContext2D;
    private canvas!: HTMLCanvasElement;
    private step = 0;
    private offsetY = 0;
    private clockInterval: any;

    constructor(
        private authService: AuthService,
        private pointService: PointService,
        private router: Router,
        private messageService: MessageService
    ) {
        const user = this.authService.currentUserValue;
        if (user) {
            this.username = user.username;
            this.groupNumber = user.groupNumber;
        }
    }

    ngOnInit(): void {
        this.loadPoints();
        this.startClock();
    }

    ngOnDestroy(): void {
        this.stopClock();
    }

    ngAfterViewInit(): void {
        this.canvas = this.canvasRef.nativeElement;
        this.ctx = this.canvas.getContext('2d')!;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        setTimeout(() => this.drawGraph(), 100);

        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));

        this.canvas.addEventListener('pointermove', (e) => {
            this.stopClock();
            this.displayCurCoordinates(e);
        });

        this.canvas.addEventListener('pointerleave', () => {
            this.startClock();
        });
    }

    onCanvasClick(e: MouseEvent): void {
        this.calculateCurCoordinates(e);

        this.x = this.canvasX;
        this.y = this.canvasY;

        this.submitPoint();
    }

    onSubmit(): void {
        this.x = this.sliderX;
        this.y = this.sliderY;

        this.submitPoint();
    }

    onRChange(): void {
        this.drawGraph();
    }

    clearPoints(): void {
        this.pointService.clearAllPoints().subscribe({
            next: () => {
                this.points = [];
                this.canvasPoints = [];
                this.drawGraph();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'All points cleared'
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to clear points'
                });
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    resetX(): void {
        this.sliderX = 0;
    }

    resetY(): void {
        this.sliderY = 0;
    }

    resetR(): void {
        this.r = 1;
        this.drawGraph();
    }

    private resizeCanvas(): void {
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
            this.drawGraph();
        }
    }

    private drawGraph(): void {
        if (!this.ctx || !this.canvas) return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.step = Math.min(width, height) / 12;
        const RDraw = this.r * this.step;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, width, height);

        this.ctx.translate(width / 2, height / 2 + this.offsetY);
        this.ctx.scale(1, -1);

        this.drawGrid();

        if (this.r != null) {
            this.ctx.fillStyle = 'rgba(1, 50, 32, 0.6)';
            this.ctx.strokeStyle = 'rgba(1, 50, 32, 0.8)';
            this.ctx.lineWidth = 1;

            this.drawCircle(RDraw);
            this.drawTriangle(RDraw);
            this.drawSquare(RDraw);
        }

        this.drawPoints();

        this.drawLabels();
    }

    private drawGrid(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const left = -width / 2;
        const right = width / 2;
        const top = height / 2;
        const bottom = -height / 2;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.setLineDash([5, 10]);
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.lineWidth = 1;

        for (let x = Math.floor(left / this.step) * this.step; x <= right; x += this.step) {
            if (Math.abs(x) > 0.1) {
                this.ctx.moveTo(x, bottom);
                this.ctx.lineTo(x, top);
            }
        }

        for (let y = Math.floor(bottom / this.step) * this.step; y <= top; y += this.step) {
            if (Math.abs(y) > 0.1) {
                this.ctx.moveTo(left, y);
                this.ctx.lineTo(right, y);
            }
        }
        this.ctx.stroke();

        this.ctx.setLineDash([]);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(left, 0);
        this.ctx.lineTo(right, 0);
        this.ctx.moveTo(0, bottom);
        this.ctx.lineTo(0, top);
        this.ctx.stroke();
        this.ctx.restore();
    }

    private drawSquare(RDraw: number): void {
        this.ctx.fillRect(0, 0, -RDraw, RDraw);
    }

    private drawCircle(RDraw: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        if (this.r >=0) {
            this.ctx.arc(0, 0, RDraw, 0, Math.PI / 2, false);
        } else {
            this.ctx.arc(0, 0, -RDraw, Math.PI, -Math.PI / 2, false);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    private drawTriangle(RDraw: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(RDraw / 2, 0);
        this.ctx.lineTo(0, -RDraw / 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    private drawPoints(): void {
        if (!this.canvasPoints || this.canvasPoints.length === 0) return;

        this.ctx.save();
        this.canvasPoints.forEach(point => {
            const hit = this.checkHit(point.x, point.y);
            this.ctx.beginPath();
            this.ctx.fillStyle = hit ? 'rgba(0, 180, 0, 0.9)' : 'rgba(200, 0, 0, 0.95)';
            this.ctx.arc(point.x * this.step, point.y * this.step, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        this.ctx.restore();
    }

    private drawLabels(): void {
        this.ctx.save();
        this.ctx.scale(1, -1);
        this.ctx.font = `${this.step / 3}px Exo`;
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const values = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        values.forEach(val => {
            const x = val * this.step;
            if (Math.abs(x) < this.canvas.width / 2) {
                this.ctx.fillText(val.toString(), x, 20);
            }
        });

        this.ctx.textAlign = 'right';
        values.forEach(val => {
            const y = val * this.step;
            if (Math.abs(y) < this.canvas.height / 2 && val !== 0) {
                this.ctx.fillText(val.toString(), -10, -y);
            }
        });

        this.ctx.restore();
    }

    private checkHit(x: number, y: number): boolean {
        return this.checkSquare(x, y) || this.checkCircle(x, y) || this.checkTriangle(x, y);
    }

    private checkSquare(x: number, y: number): boolean {
        if (this.r >= 0) {
            return x <= 0 && y >= 0 && x >= -this.r && y <= this.r;
        } else {
            return x >= 0 && y <= 0 && x <= -this.r && y >= this.r;
        }
    }

    private checkCircle(x: number, y: number): boolean {
        if (this.r >= 0) {
            return x >= 0 && y >= 0 && (x * x + y * y <= this.r * this.r);
        } else {
            return x <= 0 && y <= 0 && (x * x + y * y <= this.r * this.r);
        }
    }

    private checkTriangle(x: number, y: number): boolean {
        if (this.r >= 0) {
            return x >= 0 && y <= 0 && (x - y <= this.r / 2);
        } else {
            return x <= 0 && y >= 0 && (x - y >= this.r / 2);
        }
    }

    private submitPoint(): void {
        const request: PointRequest = {
            x: this.x,
            y: this.y,
            r: this.r
        };

        this.loading = true;
        this.pointService.checkPoint(request).subscribe({
            next: (response) => {
                this.loading = false;
                this.points.unshift(response);
                this.loadCanvasPoints();

                this.messageService.add({
                    severity: response.hit ? 'success' : 'error',
                    summary: response.hit ? 'HIT' : 'MISS',
                    detail: `Point (${response.x}, ${response.y}) - ${response.hit ? 'Hit' : 'Missed'}`
                });
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Failed to check point'
                });
            }
        });
    }

    private loadPoints(): void {
        this.pointService.getAllPoints().subscribe({
            next: (points) => {
                this.points = points;
                this.loadCanvasPoints();
            },
            error: (error) => {
                console.error('Failed to load points', error);
            }
        });
    }

    private loadCanvasPoints(): void {
        this.pointService.getCanvasPoints().subscribe({
            next: (points) => {
                this.canvasPoints = points;
                this.drawGraph();
            },
            error: (error) => {
                console.error('Failed to load canvas points', error);
            }
        });
    }

        private displayCurCoordinates(e: MouseEvent): void {
        this.calculateCurCoordinates(e);
    }

    private calculateCurCoordinates(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const x = (mouseX - centerX) / this.step;
        const y = (centerY + this.offsetY - mouseY) / this.step;

        this.canvasX = Math.round(x * 100) / 100;
        this.canvasY = Math.round(y * 100) / 100;
    }

    private startClock() {
        if (this.clockInterval) return;
        this.updateTime();
        this.clockInterval = setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    private stopClock() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }
    }

    private updateTime() {
        const now = new Date();

        const hours = now.getHours();
        const minutes = now.getMinutes();

        this.canvasX = hours;
        this.canvasY = minutes;
    }
}
