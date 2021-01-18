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
import { IntegrationControlComponent } from './widgets/integration/integration-control/integration-control.component';
import { ImageControlComponent } from './widgets/integration/integration-control/image-control/image-control.component';
import { IntegrationFooterComponent } from './widgets/integration/integration-footer/integration-footer.component';
import { ImagePlotComponent } from './widgets/image-plot/image-plot.component';
import { SidenavComponent } from './widgets/menu/sidenav/sidenav.component';
import { PathDialogComponent } from './widgets/menu/path-dialog/path-dialog.component';
import { FileSelectComponent } from './widgets/file-dialog/file-select/file-select.component';
import { FileDialogComponent } from './widgets/file-dialog/file-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    PatternPlotComponent,
    HeaderComponent,
    IntegrationComponent,
    VerticalSplitterComponent,
    HorizontalSplitterComponent,
    IntegrationControlComponent,
    ImageControlComponent,
    IntegrationFooterComponent,
    ImagePlotComponent,
    SidenavComponent,
    PathDialogComponent,
    FileSelectComponent,
    FileDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PlotlyModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MaterialsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
