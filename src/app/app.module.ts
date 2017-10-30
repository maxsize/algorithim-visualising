import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { NavigatorComponent } from './navigator.component';
import { NavigatorModule } from './navigator.module';
import { HomeComponent } from './home.component';
import { MazeGeneratorComponent } from './maze-generator.component';
import { BridsonAlgorithmComponent } from './bridson-algorithm.component';

@NgModule({
  declarations: [
    AppComponent, NavigatorComponent, HomeComponent, MazeGeneratorComponent, BridsonAlgorithmComponent
  ],
  imports: [
    BrowserModule, NavigatorModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
