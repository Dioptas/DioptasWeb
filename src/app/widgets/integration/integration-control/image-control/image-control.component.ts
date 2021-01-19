import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FileDialogComponent} from '../../../file-dialog/file-dialog.component';
import {DioptasServerService} from '../../../../shared/dioptas-server.service';

@Component({
  selector: 'app-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.css']
})
export class ImageControlComponent implements OnInit {
  browseMode = 'name';
  batchMode = 'integrate';

  imageFileName = '';
  imageDirectory = '';

  constructor(
    private dialog: MatDialog,
    public dioptasService: DioptasServerService
  ) {
    this.dioptasService.imageFileNameChanged.subscribe((filename) => {
      this.imageFileName = filename.split('/').pop();
      this.imageDirectory = filename.split('/').slice(0, -1).join('/');
    });
  }

  ngOnInit(): void {
    this.showFileDialog();
  }

  showFileDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent, {
      width: '650px',
      height: '500px',
      data: {path: this.dioptasService.imagePath}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined && result !== '') {
        this.dioptasService.load_image(result);
      }
    });
  }

}
