import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { createWorker, ITypedWorker } from "typed-web-workers";
import  * as d3  from "d3";

interface IRect
{
    width: number;
    height: number;
}
interface ICell
{
    index: number,
    direction: number
}

@Component({
    selector:'random-traversal',
    template:`
        <div>
            <h1>Random Traversal</h1>
            <canvas #stage width="{{stageWidth}}" height="{{stageHeight}}"></canvas>
            <div>
                <button (click)="start()">Start</button>
                <button (click)="stopFlooding()">Stop</button>
            </div>
        </div>
    `
})
export class RandomTraversalComponent implements AfterViewInit
{
    @ViewChild('stage') canvas:ElementRef;
    stageWidth:number = 900;
    stageHeight:number = 600;
    timer: any;

    worker: ITypedWorker<IRect, number[]>;

    constructor()
    {
    }

    ngAfterViewInit(): void
    {
        let context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
        context.fillStyle = "#f3f3f3";
        context.rect(0, 0, this.stageWidth, this.stageHeight);
        context.fill();
    }

    start():void
    {
        this.worker = createWorker(this.generateMaze, (output:number[]) => this.onMazeGenerated(output));
        this.worker.postMessage({width:this.stageWidth, height:this.stageHeight});
    }

    stopFlooding(): void
    {
        if (this.timer) clearInterval(this.timer);
    }

    onMazeGenerated(output:number[]): void
    {
        this.worker.terminate();
        let N = 1 << 0, 
            E = 1 << 1, 
            S = 1 << 2, 
            W = 1 << 3;
  
        let width = this.stageWidth, height = this.stageHeight;
        let context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
        let cells:number[] = output,
            distance = 0,
            visited: boolean[] = new Array(width * height),
            image = context.createImageData(width, height);
        let frontier: number[] = [(height - 1) * width];
    
        function flood() {
            var frontier1:number[] = [],
                i0,
                n0 = frontier.length,
                i1,
                color = d3.hsl((distance += 0.5) % 360, 1, .5).rgb();
        
            for (var i = 0; i < n0; ++i) {
                i0 = frontier[i] << 2;
                image.data[i0 + 0] = color.r;
                image.data[i0 + 1] = color.g;
                image.data[i0 + 2] = color.b;
                image.data[i0 + 3] = 255;
            }
            
            for (var i = 0; i < n0; ++i) {
                i0 = frontier[i];
                if (cells[i0] & E && !visited[i1 = i0 + 1]) visited[i1] = true, frontier1.push(i1);
                if (cells[i0] & W && !visited[i1 = i0 - 1]) visited[i1] = true, frontier1.push(i1);
                if (cells[i0] & S && !visited[i1 = i0 + width]) visited[i1] = true, frontier1.push(i1);
                if (cells[i0] & N && !visited[i1 = i0 - width]) visited[i1] = true, frontier1.push(i1);
            }
    
            frontier = frontier1;
            return !frontier1.length;
        }
        this.timer = setInterval(() => {
            let done = flood();
            context.putImageData(image, 0, 0);
            console.log(done);
            if (done) this.stopFlooding();
        }, 3);
    }
    
    generateMaze(rect:IRect, postMessage:Function): void
    {
        let N = 1 << 0, 
            E = 1 << 1, 
            S = 1 << 2, 
            W = 1 << 3;
        let cells:number[] = [];
        let startIndex = rect.width * (rect.height - 1);
        cells[startIndex] = 0;
        let frontiers:ICell[] = [];
        frontiers.push({index:startIndex, direction:N});
        frontiers.push({index:startIndex, direction:E});

        let randomPop = (arr:ICell[]) => {
            shuffle(arr);
            return arr.pop();
        }

        let shuffle = (arr:ICell[]) => {
            let len = arr.length, r = Math.random()*len | 0, t:ICell;
            t = arr[r];
            arr[r] = arr[len-1];
            arr[len-1] = t;
        }

        let c:ICell = randomPop(frontiers);
        while (c)
        {
            let i1 = c.index + (c.direction === N ? -rect.width : c.direction === S ? rect.width : c.direction === E ? 1 : -1);
            let x0 = c.index % rect.width;
            let y0 = c.index / rect.width | 0;
            let x1 = i1 % rect.width;
            let y1 = i1 / rect.width | 0;
            let d1 = c.direction === N ? S : c.direction === E ? W : E;
            let open:boolean = cells[i1] == null;
            if (open)
            {
                cells[c.index] |= c.direction;
                cells[i1] |= d1;    // merge direction to array, for color calculation
                // now push legal frontiers into array
                if (y1 > 0 && cells[i1 - rect.width] == null) frontiers.push({index:i1, direction:N});                  // check north
                if (y1 < rect.height-1 && cells[i1 + rect.width] == null) frontiers.push({index:i1, direction:S});      // check south
                if (x1 > 0 && cells[i1 - 1] == null) frontiers.push({index:i1, direction:W});                           // check west
                if (x1 < rect.width - 1 && cells[i1 + 1] == null) frontiers.push({index:i1, direction:E});              // check east
            }
            c = randomPop(frontiers);
        }
        postMessage(cells);
    }
}