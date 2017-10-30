import { Component, AfterViewInit, ViewChild, ElementRef, Input } from "@angular/core";
import { Point } from "./DataStructures";

@Component({
    selector:'bridson-algorithm',
    template:`
        <div>
            <canvas #stage width="{{stageWidth}}" height="{{stageHeight}}"></canvas>
            <li>
                <span>Maximums sampler</span>
                <input type="text" [(ngModel)]="maxSampler"/>
                <button (click)="start()">Start</button>
                <button (click)="stop()">Stop</button>
                <button (click)="reset()">Reset</button>
                <button (click)="sampler()">Sampler</button>
            </li>
        </div>
        <img #img (load)="onImageLoaded()" src="./assets/pic.jpg" style="display:none;">
        <canvas #pic width="{{stageWidth}}" height="{{stageHeight}}" style="display:none;"></canvas>
    `
})
export class BridsonAlgorithmComponent implements AfterViewInit
{
    @ViewChild('stage') stage:ElementRef;
    @ViewChild('pic') pic:ElementRef;
    @ViewChild('img') img:ElementRef;
    title = "Bridson's random sampler algorithm"
    dotRadius: number = 1;
    stageWidth:number = 800;
    stageHeight:number = 600;
    maxSampler:number = 20;
    radius:number = 4;
    imgData: ImageData;
    
    timer: any;
    actives:Point[];
    inactives:Point[];

    ngAfterViewInit(): void {
        this.reset();
        // this.onImageLoaded();
    }

    onImageLoaded(): void
    {
        let origin = this.pic.nativeElement;
        let ctx = origin.getContext('2d');
        ctx.drawImage(this.img.nativeElement, 0, 0);
        this.imgData = ctx.getImageData(0, 0, this.stageWidth, this.stageHeight);
        console.log("img loaded", this.imgData.data.length)
    }

    reset(): void
    {
        stop();
        let canvas = this.canvas;
        canvas.fillStyle = "#f3f3f3";
        canvas.fillRect(0, 0, this.stageWidth, this.stageHeight);
        this.actives = [];
        this.inactives = [];
        let firstDot = new Point(Math.random()*this.stageWidth, Math.random()*this.stageHeight);
        this.actives.push(firstDot);
    }

    start():void
    {
        this.reset();
        this.timer = setInterval(() => this.sampler(), 3);
    }

    sampler():void
    {
        if (this.actives.length == 0)
        {
            stop();
            return;
        }
        let p = this.pickRandom();
        let sample = this.samplerFor(p);
        if (sample)
        {
            this.actives.push(sample);
            // this.drawDot(sample, "red");
        }
        else
        {
            this.inactives.push(p);
            let index = this.actives.indexOf(p);
            this.actives.splice(index, 1);
            // this.drawDot(p, "black");
            this.drawDot(p, "image");
        }
    }

    samplerFor(p:Point)
    {
        let count = 0;
        let sample:Point;
        let all:Point[] = this.actives.concat(this.inactives);
        while (count < this.maxSampler)
        {
            let ran = this.getRandomPointWithinAnnulus(p);
            let valid = true;
            for (var i = 0; i < all.length; i++) {
                var element = all[i];
                if (element === p) continue;
                if (ran.distance(element) < this.radius || 
                (ran.x > this.stageWidth || ran.x < 0 || ran.y > this.stageHeight || ran.y < 0))
                {
                    valid = false;
                    break;
                }
            }
            if (valid)
            {
                sample = ran;
                break;
            }
            count++;
        }
        return sample;
    }

    pickRandom(): Point
    {
        let ran = Math.floor(Math.random() * this.actives.length);
        return this.actives[ran];
    }

    stop():void
    {
        if (this.timer)
            clearTimeout(this.timer);
    }

    getRandomPointWithinAnnulus(center:Point): Point
    {
        let ranx = this.radius + Math.random()*this.radius;
        let rany = this.radius + Math.random()*this.radius;
        let flag = () => {return Math.random() > 0.5 ? 1:-1};
        return new Point(center.x + ranx * flag(), center.y + rany * flag());
    }

    drawDot(p:Point, color:string): void
    {
        let ctx = this.canvas;
        if (color == "image")
        {
            // ctx.beginPath();
            // ctx.drawImage(img, p.x - this.radius/2, p.y - this.radius/2, this.radius, this.radius, p.x - this.radius/2, p.y - this.radius/2, this.radius, this.radius);
            // ctx.drawImage(img, p.x - this.radius, p.y - this.radius, this.radius*2, this.radius*2, p.x - this.radius, p.y - this.radius, this.radius*2, this.radius*2);
            let data = this.imgData;
            try
            {
                let r:string = data.data[Math.floor(p.x*data.width*4) + Math.floor(p.y*4)].toString(16);
                let g:string = data.data[Math.floor(p.x*data.width*4) + Math.floor(p.y*4)+1].toString(16);
                let b:string = data.data[Math.floor(p.x*data.width*4) + Math.floor(p.y*4)+2].toString(16);
                let color = "#"+r+g+b;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.rect(p.x - this.radius, p.y - this.radius, this.radius*2, this.radius*2);
                ctx.fill();
            }
            catch(e)
            {
                console.log("wrong pos:", Math.floor(p.x*data.width*4) , Math.floor(p.y*4), p);
            }
        }
        else
        {
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, this.dotRadius, 0, 2*Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    get canvas():CanvasRenderingContext2D
    {
        let ele:HTMLCanvasElement = this.stage.nativeElement;
        return ele.getContext('2d');
    }
}