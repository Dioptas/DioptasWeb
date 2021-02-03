import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './widgets/header/header.component';

import {MaterialsModule} from './shared/materials.module';
import {IntegrationComponent} from './views/integration/integration.component';
import { VerticalSplitterComponent } from './widgets/utility/splitter/vertical-splitter/vertical-splitter.component';
import { HorizontalSplitterComponent } from './widgets/utility/splitter/horizontal-splitter/horizontal-splitter.component';
import { IntegrationControlComponent } from './widgets/integration/integration-control/integration-control.component';
import { ImageControlComponent } from './widgets/integration/integration-control/image-control/image-control.component';
import { IntegrationFooterComponent } from './widgets/integration/integration-footer/integration-footer.component';
import { ImagePlotComponent } from './widgets/plots/image-plot/image-plot.component';
import { SidenavComponent } from './widgets/menu/sidenav/sidenav.component';
import { PathDialogComponent } from './widgets/menu/path-dialog/path-dialog.component';
import { FileSelectComponent } from './widgets/utility/file-dialog/file-select/file-select.component';
import { FileDialogComponent } from './widgets/utility/file-dialog/file-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { LabeledNumberComponent } from './widgets/utility/labeled-number/labeled-number.component';
import { ImagePositionComponent } from './widgets/integration/integration-footer/image-position/image-position.component';
import { AnglesComponent } from './widgets/integration/integration-footer/angles/angles.component';
import { PatternPositionComponent } from './widgets/integration/integration-footer/pattern-position/pattern-position.component';
import { PatternPlotComponent } from './widgets/plots/pattern-plot/pattern-plot.component';
import { OverlayControlComponent } from './widgets/integration/integration-control/overlay-control/overlay-control.component';

@NgModule({
  declarations: [
    AppComponent,
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
    LabeledNumberComponent,
    ImagePositionComponent,
    AnglesComponent,
    PatternPositionComponent,
    PatternPlotComponent,
    OverlayControlComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
