import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  inputLabel: string;
}

@Component({
  selector: 'app-open-project-dialog',
  templateUrl: './path-dialog.component.html',
  styleUrls: ['./path-dialog.component.css']
})
export class PathDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }
}
