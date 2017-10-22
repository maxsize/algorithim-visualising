import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Point } from "./DataStructures";

@Component({
    selector:"maze-generator",
    template:`<div>
        <h1>Maze Generator</h1>
        <canvas #stage width="400px" height="400px"></canvas>
        <div >
            <button (click)="draw()">Draw</button>
            <button (click)="step()">Step</button>
        </div>
    </div>`
})
export class MazeGeneratorComponent implements AfterViewInit
{
    @ViewChild('stage') stage:ElementRef;

    CELL_SIZE:number = 80;
    current:Point = null;
    map:number[][] = null;
    path:Point[] = null;
    found:Point[] = null;
    totalRow:number = 0;
    totalCol:number = 0;
    timer;
    initialized:boolean = false;

    ngAfterViewInit(): void {
        this.reset()
    }

    reset()
    {
        let canvas:HTMLCanvasElement = this.stage.nativeElement;
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d')
        ctx.fillStyle = '#d3d3d3'
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // draw cells
        let cols:number = canvas.width/this.CELL_SIZE;
        let rows:number = canvas.height/this.CELL_SIZE;
        ctx.strokeStyle = "#0"
        ctx.beginPath();
        for (var i = 0; i <= rows; i++) {
            let y = i * this.CELL_SIZE;
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        for (var j = 0; j <= cols; j++) {
            let x = j * this.CELL_SIZE;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        ctx.stroke();
        this.totalCol = cols;
        this.totalRow = rows;
        return [cols, rows];
    }

    init()
    {
        let size = this.reset();
        this.current = new Point(Math.floor(Math.random()*size[0]), Math.floor(Math.random()*size[1]));
        this.map = [];
        this.path = [];
        this.found = [];
        this.path.push(this.current);
        this.map[this.current.y] = []
        this.map[this.current.y][this.current.x] = 1;
        this.initialized = true;
        this.drawCell(this.current, "#fc9fd8");
    }

    draw()
    {
        console.log("start drawing");
        this.init();
        this.timer = setInterval(() => this.next(), 100);
    }

    step()
    {
        if (!this.initialized) this.init();
        this.next();
    }

    private next()
    {
        let p = this.findAdjacentEmptyCell(this.path[this.path.length - 1]);
        if (p)
        {
            // found available adjacent cell
            this.path.push(p);
            this.drawCell(p, "#fc9fd8");
            console.log("empty", p);
        }
        else
        {
            // no more available adjacent cell found, put current cell to found array
            let last = this.path.pop();
            this.found.push(last);
            console.log("found end", last);
            this.drawCell(last, "#ffffff")
        }
        if (this.path.length == 0)
        {
            // no more empty cell available, end process
            clearInterval(this.timer);
        }
    }

    private drawCell(p:Point, color:string)
    {
        let x = p.x * this.CELL_SIZE + 1;
        let y = p.y * this.CELL_SIZE + 1;
        let width = this.CELL_SIZE - 2;
        let height = this.CELL_SIZE - 2;
        let canvas:HTMLCanvasElement = this.stage.nativeElement;
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d')
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    private findAdjacentEmptyCell(p:Point):Point
    {
        let next:Point = null;
        let arr = [
            {dir:'x', value:-1},
            {dir:'x', value:1},
            {dir:'y', value:-1},
            {dir:'y', value:1}
        ]
        while(next == null && arr.length > 0)
        {
            let ran = Math.floor(Math.random() * arr.length);
            let obj = arr[ran];
            next = this.findAdjacent(p, obj.dir, obj.value);
            arr.splice(ran, 1);
        }
        return next;
    }

    private findAdjacent(p:Point, dir:string, value:number):Point
    {
        let rowNum = dir == 'x' ? p.y:p.y + value;
        let colNum = dir == 'x' ? p.x + value:p.x;
        if (rowNum >= this.totalRow || colNum >= this.totalCol
            || rowNum < 0 || colNum < 0) return null;    // reaches the edge
        if (this.map[rowNum] == null) this.map[rowNum] = [];
        let row = this.map[rowNum];
        if (row[colNum] == null)
        {
            row[colNum] = 1;    // mark cell as occupied
            return new Point(colNum, rowNum);
        }
        else return null;
    }
}