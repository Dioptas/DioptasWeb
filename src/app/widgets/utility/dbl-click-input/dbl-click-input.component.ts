import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dbl-click-input',
  templateUrl: './dbl-click-input.component.html',
  styleUrls: ['./dbl-click-input.component.scss']
})
export class DblClickInputComponent {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('input') input;

  editing = false;

  constructor() { }

  doubleClicked(): void {
    this.editing = true;
    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.select();
    }, 0);
  }

  nameChanged(ev): void {
    this.value = ev.target.value;
    this.valueChange.emit(this.value);
    this.editing = false;
  }
}
