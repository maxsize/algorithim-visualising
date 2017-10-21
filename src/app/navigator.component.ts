import { Component } from "@angular/core";
import { NavigatorModule, NAV_ROUTE, NamedRoute } from "./navigator.module";

@Component({
    selector:"nav",
    templateUrl:"./navigator.component.html",
    styleUrls:["./navigator.component.css"]
})

export class NavigatorComponent
{
    title:string = "Navigator";
    nav:NamedRoute[] = NAV_ROUTE.concat();
    constructor()
    {
        this.nav.shift();
    }
}