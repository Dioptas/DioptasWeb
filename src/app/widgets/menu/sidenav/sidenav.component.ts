import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PathDialogComponent} from '../path-dialog/path-dialog.component';
import {MatSidenav} from '@angular/material/sidenav';
import {SidenavService} from './sidenav.service';
import {DioptasServerService} from '../../../shared/dioptas-server.service';
import {NumpyLoader} from '../../../lib/numpy-loader';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer', {static: true}) drawer: MatSidenav;
  private webSocket: WebSocket;

  constructor(
    public dialog: MatDialog,
    public sidenavService: SidenavService,
    public dioptasServer: DioptasServerService
  ) {
  }

  ngOnInit(): void {

    // this.webSocket = new WebSocket('ws://127.0.0.1:64999');
    // // this.webSocket.binaryType = 'arraybuffer';
    //
    // this.webSocket.onopen = () => {
    //   console.log('Web socket connected ');
    //   this.webSocket.send('HAAAAALLLOOOO!');
    // };
    // this.webSocket.onmessage = (event) => {
    //   console.log('some message has been sent!');
    //   console.log(event.data);
    //   const arrayBuffer = event.data.arrayBuffer().then((val) => {
    //       console.log(NumpyLoader.fromArrayBuffer(val));
    //     }
    //   );
    // };
    // this.webSocket.onclose = () => {
    //   console.log('Web socket connection is closed!');
    // };
  }

  // sendMessage(): void {
  //   this.webSocket.send('LALALALALA');
  // }

  showOpenProjectDialog(): void {
    this.sidenavService.toggle();
    const dialogRef = this.dialog.open(PathDialogComponent, {
      width: '450px',
      data: {title: 'Open Project', inputLabel: 'Filepath'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  showSaveProjectDialog(): void {
    this.sidenavService.toggle();
    const dialogRef = this.dialog.open(PathDialogComponent, {
      width: '450px',
      data: {title: 'Save Project', inputLabel: 'Filepath'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
