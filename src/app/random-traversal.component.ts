import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { createWorker, ITypedWorker } from "typed-web-workers";
import  * as d3  from "d3-color";

interface IInput
{
    rect: IRect;
    context: any;
}
interface IOutput
{
    value: number[];
    context: any;
}
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
            
            <canvas #stage width="{{stageWidth}}" height="{{stageHeight}}"></canvas>        
        </div>
    `
})
export class RandomTraversalComponent implements OnInit, AfterViewInit
{
    @ViewChild('stage') canvas:ElementRef;
    stageWidth:number = 900;
    stageHeight:number = 600;

    worker: ITypedWorker<IInput, IOutput>;

    constructor()
    {
    }

    ngAfterViewInit():void
    {
        this.worker = createWorker(this.generateMaze, this.onMazeGenerated);
        // worker.onMessage = output => console.log("outout");
        this.worker.postMessage({
            rect:{width:this.stageWidth, height:this.stageHeight},
            context:null
        });
        // worker.postMessage({width:10, height:10});
    }
    
    ngOnInit(): void
    {
        
    }

    onMazeGenerated(output:IOutput): void
    {
        console.log(output);
        output.context.worker.terminate();
        let _this = output.context;
        let maze = output.value;
        // this.worker.terminate();
        var N = 1 << 0,
        S = 1 << 1,
        W = 1 << 2,
        E = 1 << 3;
  
        let width = _this.stageWidth, height = _this.stageHeight;
        let context = (_this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
        var cells:number[] = maze,
            distance = 0,
            visited = new Array(width * height),
            frontier = [(height - 1) * width],
            image = context.createImageData(width, height);
    
        function flood() {
            var frontier1 = [],
                i0,
                n0 = frontier.length,
                i1,
                color = d3.hsl((distance += .5) % 360, 1, .5).rgb();
        
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
    }
    
    generateMaze(value:IInput, postMessage:Function): void
    {
        let rect = value.rect;
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
        postMessage({value:cells, context:value.context});
    }
}