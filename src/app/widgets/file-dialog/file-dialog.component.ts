import {Component, EventEmitter, Output, Input} from '@angular/core';
import {DioptasServerService} from '../../shared/dioptas-server.service';

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.css']
})
export class FileDialogComponent {
  @Output() fileSelected = new EventEmitter<string>();
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
    private dioptasService: DioptasServerService
  ) {
    this._getDirList();
    this.dioptasService.updatedDirList.subscribe((dirList) => {
      if (dirList === undefined) {
        this.currentDirectory = this.oldPath;
      } else {
        this.dirList = dirList;
        this.showBackButton = this.currentDirectory !== '';
      }
    });
  }

  onFileSelected(file: string): void {
    this.fileSelected.emit(this.currentDirectory + file);
  }

  onFolderSelected(folder: string): void {
    if (this.currentDirectory === '') {
      this.currentDirectory = folder;
    } else {
      this.currentDirectory += '/' + folder;
    }
    this._getDirList();
  }

  onFolderUpSelected(): void {
    this.currentDirectory = this.currentDirectory.split('/').slice(0, -1).join('/');
    this._getDirList();
  }

  _getDirList(): void {
    this.dioptasService.getDirList('./' + this.currentDirectory);
  }

  pathInputChanged(event): void {
    const newPath = event.target.value;
    this.oldPath = this.currentDirectory;
    this.currentDirectory = newPath;
    this._getDirList();
  }
}
