import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlotlyExampleComponent } from './plotly-example/plotly-example.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';

import { MaterialsModule } from './shared/materials.module';

@NgModule({
  declarations: [
    AppComponent,
    PlotlyExampleComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    PlotlyModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
