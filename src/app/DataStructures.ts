/*
  Data type implementations
*/

export class Point
{
    static ZERO:Point = new Point(0, 0);

    x?:number = 0;
    y?:number = 0;

    constructor(x:number, y:number)
    {
        this.x = x;
        this.y = y;
    }

    get length():number
    {
        return this.distance();
    }

    distance(target:Point = null):number
    {
        let t = target ? target : Point.ZERO;
        return Math.sqrt(Math.pow(this.x - t.x, 2) + Math.pow(this.y - t.y, 2));
    }
}