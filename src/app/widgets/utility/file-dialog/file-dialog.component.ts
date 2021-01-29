import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DioptasServerService} from '../../../shared/dioptas-server.service';

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.css']
})
export class FileDialogComponent {
  public currentDirectory = '';

  dirList: {
    files: string[],
    folders: string[]
  };

  showBackButton = false;
  oldPath = '.';

  constructor(
    public dialogRef: MatDialogRef<FileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { path: string },
    private dioptasService: DioptasServerService
  ) {
    this.dirList = {files: [], folders: []};
    this.currentDirectory = data.path;
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
