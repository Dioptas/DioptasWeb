import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.css']
})
export class FileSelectComponent implements OnInit {
  @Output() fileSelected = new EventEmitter<string>();
  @Output() folderSelected = new EventEmitter<string>();
  @Output() folderUpClicked = new EventEmitter();
  @Input() dirList: {folders: string[], files: string[]};
  @Input() showBackButton = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  folderClicked(folder: string): void {
    this.folderSelected.emit(folder);
  }

  fileClicked(file: string): void {
    this.fileSelected.emit(file);
  }
}
