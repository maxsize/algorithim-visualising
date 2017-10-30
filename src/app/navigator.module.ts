import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { MazeGeneratorComponent } from "./maze-generator.component";
import { HomeComponent } from "./home.component";
import { BridsonAlgorithmComponent } from "./bridson-algorithm.component";

export const NAV_ROUTE:NamedRoute[] = [
    {path:"", redirectTo:"/home", pathMatch:"full"},
    {path:"home", component:HomeComponent, name:"Home"},
    {path:"maze-generator", component:MazeGeneratorComponent, name:"Maze Generator"},
    {path:"bridson-algorithm", component:BridsonAlgorithmComponent, name:"Bridson Random Sampling"}
];

@NgModule({
    imports:[RouterModule.forRoot(NAV_ROUTE)],
    exports:[RouterModule]
})
export class NavigatorModule
{}

export interface NamedRoute extends Route {
    name?: string;
}