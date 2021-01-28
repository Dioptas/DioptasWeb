import {Component, AfterViewInit, HostListener, ViewChild} from '@angular/core';

@Component({
  selector: 'app-integration-view',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.css']
})
export class IntegrationComponent implements AfterViewInit {
  @ViewChild('integrationContainer') integrationContainer;
  height: number;

  patternMousePosition = {x: 0, y: 0};
  imageMousePosition = {x: 0, y: 0, intensity: 0};
  imageClickPosition = {x: 0, y: 0, intensity: 0};

  @HostListener('window:resize', ['$event'])
  onResize(_: any): void {
    this.height = this.integrationContainer.nativeElement.clientHeight;
  }

  ngAfterViewInit(): void {
    this.height = this.integrationContainer.nativeElement.clientHeight;
  }
}
