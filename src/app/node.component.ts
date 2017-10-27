import { Component } from "@angular/core";

@Component({
    selector:"node",
    template:`<div class="node" (mousedown)="startDrag($event)" (mouseup)="stopDrag($event)"
                   (mousemove)="drag($event)" [style.left]="left" [style.top]="top">
    </div>`,
    styles:[`
    .node{
        position: relative;
        width: 60px;
        height: 30px;
        background-color: #334041;
        color: #ffffff;
        font-size: 0.8em;
        text-align: center;
        display: inline-block;
    }
    .node p{
        /* vertical-align: middle; */
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }`]
})
export class NodeComponent
{
    top:string = "100px";
    left:string = "100px";

    downX = 0;
    downY = 0;
    offsetX = 0;
    offsetY = 0;
    isDown = false;

    startDrag(event)
    {
        this.downX = event.clientX;
        this.downY = event.clientY;
        this.offsetX = event.offsetX;
        this.offsetY = event.offsetY;
        this.isDown = true;
    }

    drag(event)
    {
        if (this.isDown)
        {
            let offX = event.clientX - this.downX;
            let offY = event.clientY - this.downY;
            this.left = (this.downX + offX - this.offsetX) + "px";
            this.top  = (this.downY + offY - this.offsetY) + "px";
        }
    }

    stopDrag(event)
    {
        this.isDown = false;        
    }
}