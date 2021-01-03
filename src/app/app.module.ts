import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import {PlotlyModule} from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PatternPlotComponent} from './widgets/pattern-plot/pattern-plot.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './widgets/header/header.component';

import {MaterialsModule} from './shared/materials.module';
import {IntegrationComponent} from './views/integration/integration.component';
import { VerticalSplitterComponent } from './widgets/splitter/vertical-splitter/vertical-splitter.component';
import { HorizontalSplitterComponent } from './widgets/splitter/horizontal-splitter/horizontal-splitter.component';

@NgModule({
  declarations: [
    AppComponent,
    PatternPlotComponent,
    HeaderComponent,
    IntegrationComponent,
    VerticalSplitterComponent,
    HorizontalSplitterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PlotlyModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
