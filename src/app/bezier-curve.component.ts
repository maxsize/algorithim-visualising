import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Point } from "./DataStructures";

@Component({
    selector:'bezier-curve',
    template:`
    <div>
        <h1>Bezier Curve</h1>
        <canvas #stage width="{{stageWidth}}" height="{{stageHeight}}" (mousedown)="onDrag($event)" (mousemove)="onDragMove($event)" (mouseup)="onDragEnd()"></canvas>
        <div>
            <button (click)="start()">Start</button>
            <button (click)="draw()">Draw</button>
            <button (click)="stop()">Stop</button>
        </div>
    </div>
    `
})
export class BezierCurveComponent implements AfterViewInit
{
    @ViewChild('stage') canvas:ElementRef;
    
    stageWidth:number = 900;
    stageHeight:number = 600;
    radius:number = 3;
    lineColor:string = "gray";
    dotColor:string = "red";
    
    timer: any;
    anchor1: Point;
    anchor2: Point;
    joint: Point;
    
    isMouseDown: boolean = false;
    downX: number = 0;
    downY: number = 0;
    bound: ClientRect;
    dragger: Point;
    
    ngAfterViewInit(): void {
        this.start();
        this.draw();
    }

    onDrag(e:MouseEvent): void
    {
        this.isMouseDown = true;
        this.downX = e.clientX;
        this.downY = e.clientY;
        this.bound = (this.canvas.nativeElement as HTMLCanvasElement).getBoundingClientRect();
        let local: Point = new Point(e.x - this.bound.left, e.y - this.bound.top);
        if (this.anchor1.distance(local) < this.radius) this.dragger = this.anchor1;
        else if (this.anchor2.distance(local) < this.radius) this.dragger = this.anchor2;
        else if (this.joint.distance(local) < this.radius) this.dragger = this.joint;
    }

    onDragMove(e:MouseEvent): void
    {
        if (!this.isMouseDown || !this.dragger) return;
        this.dragger.x = e.x - this.bound.left;
        this.dragger.y = e.y - this.bound.top;
        this.draw();
    }

    onDragEnd(): void
    {
        this.isMouseDown = false;
        this.dragger = null;
    }

    start(): void
    {
        this.anchor1 = new Point(Math.random()*this.stageWidth|0, Math.random()*this.stageHeight|0);
        this.anchor2 = new Point(Math.random()*this.stageWidth|0, Math.random()*this.stageHeight|0);
        this.joint = new Point(Math.random()*this.stageWidth|0, Math.random()*this.stageHeight|0);
    }

    draw(): void
    {
        let ctx:CanvasRenderingContext2D = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
        ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.drawDot(this.anchor1, this.dotColor);
        this.drawDot(this.anchor2, this.dotColor);
        this.drawDot(this.joint, this.dotColor);
        this.drawLine(this.joint, this.anchor1, this.lineColor);
        this.drawLine(this.joint, this.anchor2, this.lineColor);
        ctx.beginPath();
        ctx.bezierCurveTo(this.anchor1.x, this.anchor1.y, this.joint.x, this.joint.y, this.anchor2.x, this.anchor2.y);
        ctx.stroke();
    }

    drawDot(p:Point, color:string): void
    {
        let ctx:CanvasRenderingContext2D = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.radius, 0, Math.PI*2);
        ctx.stroke();
    }

    drawLine(p1:Point, p2:Point, color:string): void
    {
        let ctx:CanvasRenderingContext2D = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }

    stop(): void
    {
        if (this.timer) clearInterval(this.timer);
    }
}