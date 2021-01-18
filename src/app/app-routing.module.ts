import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IntegrationComponent} from './views/integration/integration.component';
import {FileSelectComponent} from './widgets/file-dialog/file-select/file-select.component';

const routes: Routes = [
  {path: '', component: IntegrationComponent},
  {path: 'fileSelect', component: FileSelectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
