import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FileDialogComponent} from '../../../utility/file-dialog/file-dialog.component';
import {ImageService} from '../../../../shared/model/image.service';

@Component({
  selector: 'app-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.css']
})
export class ImageControlComponent implements OnInit {
  browseMode = 'name';
  batchMode = 'integrate';

  imageFilename = '';
  imageDirectory = '';

  constructor(
    private dialog: MatDialog,
    public imageService: ImageService
  ) {
    this.imageService.imageFilename.subscribe((filename) => {
      this.imageFilename = filename.split('/').pop();
      this.imageDirectory = filename.split('/').slice(0, -1).join('/');
    });
  }

  ngOnInit(): void {
  }

  showFileDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent, {
      width: '650px',
      height: '500px',
      data: {path: this.imageService.imagePath}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined && result !== '') {
        this.imageService.load_image(result);
      }
    });
  }

}
