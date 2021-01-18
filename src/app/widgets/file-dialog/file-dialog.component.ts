import {Component, Input} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DioptasServerService} from '../../shared/dioptas-server.service';

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.css']
})
export class FileDialogComponent {
  @Input() currentDirectory = '';

  showBackButton = false;
  oldPath = '.';

  dirList = {
    files: [
      'image1.tif',
      'image2.tif',
      'image3.tif'],
    folders: [
      'folder1',
      'folder2',
      'folder3',
    ]
  };

  constructor(
    public dialogRef: MatDialogRef<FileDialogComponent>,
    private dioptasService: DioptasServerService
  ) {
    this.getDirList();
  }

  onFileSelected(file: string): void {
    const selectedFile = this.currentDirectory === '' ? file : this.currentDirectory + '/' + file;
    this.dialogRef.close(selectedFile);
  }

  onFolderSelected(folder: string): void {
    if (this.currentDirectory === '') {
      this.currentDirectory = folder;
    } else {
      this.currentDirectory += '/' + folder;
    }
    this.getDirList();
  }

  onFolderUpSelected(): void {
    this.currentDirectory = this.currentDirectory.split('/').slice(0, -1).join('/');
    this.getDirList();
  }

  getDirList(): void {
    this.dioptasService.getDirList('./' + this.currentDirectory, (dirList) => {
      if (dirList === undefined) {
        this.currentDirectory = this.oldPath;
      } else {
        this.dirList = dirList;
        this.showBackButton = this.currentDirectory !== '';
      }
    });
  }

  pathInputChanged(event): void {
    const newPath = event.target.value;
    this.oldPath = this.currentDirectory;
    this.currentDirectory = newPath;
    this.getDirList();
  }
}
