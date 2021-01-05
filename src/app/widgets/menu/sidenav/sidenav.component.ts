import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PathDialogComponent} from '../path-dialog/path-dialog.component';
import {MatSidenav} from '@angular/material/sidenav';
import {SidenavService} from './sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit{
  @ViewChild('drawer', {static: true}) drawer: MatSidenav;

  constructor(
    public dialog: MatDialog,
    public sidenavService: SidenavService
  ) {
  }

  ngOnInit(): void {
  }

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
