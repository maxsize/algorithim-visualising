import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavigatorComponent } from './navigator.component';
import { NavigatorModule } from './navigator.module';
import { HomeComponent } from './home.component';
import { MazeGeneratorComponent } from './maze-generator.component';

@NgModule({
  declarations: [
    AppComponent, NavigatorComponent, HomeComponent, MazeGeneratorComponent
  ],
  imports: [
    BrowserModule, NavigatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
