import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-integration-footer',
  templateUrl: './integration-footer.component.html',
  styleUrls: ['./integration-footer.component.css']
})
export class IntegrationFooterComponent implements OnInit {
  @Input() patternMousePosition = {x: 0, y: 0};
  @Input() imageMousePosition = {x: 0, y: 0};

  constructor() {
  }

  ngOnInit(): void {
  }

}
