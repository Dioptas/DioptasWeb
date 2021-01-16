import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IntegrationComponent} from './views/integration/integration.component';
import {FileSelectComponent} from './widgets/file-dialog/file-select/file-select.component';
import {FileDialogComponent} from './widgets/file-dialog/file-dialog.component';

const routes: Routes = [
  {path: '', component: FileDialogComponent}, // IntegrationComponent},
  {path: 'fileSelect', component: FileSelectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
