import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {SidenavService} from './sidenav.service';
import {DioptasServerService} from '../../../shared/dioptas-server.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  @ViewChild('drawer', {static: true}) drawer: MatSidenav;

  constructor(
    public sidenavService: SidenavService,
    public dioptasServer: DioptasServerService
  ) {
  }

  load_dummy_project(): void {
    this.dioptasServer.load_dummy_project();
    this.sidenavService.close();
  }

  load_dummy2_project(): void {
    this.dioptasServer.load_dummy2_project();
    this.sidenavService.close();
  }
}
