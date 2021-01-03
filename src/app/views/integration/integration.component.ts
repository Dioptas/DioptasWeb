import {Component, OnInit, AfterViewInit, HostListener, ViewChild} from '@angular/core';

@Component({
  selector: 'app-integration-view',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.css']
})
export class IntegrationComponent implements OnInit, AfterViewInit {
  @ViewChild('integrationContainer') integrationContainer;
  height: number;
  patternMousePosition = {x: 0, y: 0};

  @HostListener('window:resize', ['$event'])
  onResize(_: any): void {
    this.height = this.integrationContainer.nativeElement.clientHeight;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.height = this.integrationContainer.nativeElement.clientHeight;
  }

  patternMouseMoved(mousePosition): void {
    this.patternMousePosition = mousePosition;
  }
}
