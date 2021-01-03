import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatternPlotComponent } from './pattern-plot/pattern-plot.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';

import { MaterialsModule } from './shared/materials.module';
import { IntegrationViewComponent } from './integration-view/integration-view.component';

@NgModule({
  declarations: [
    AppComponent,
    PatternPlotComponent,
    HeaderComponent,
    IntegrationViewComponent
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
