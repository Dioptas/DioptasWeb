import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImagePlotComponent} from './image-plot.component';
import {DataGeneratorService} from '../../../shared/data-generator.service';
import {MousePositionService} from '../../../shared/mouse-position.service';
import {DioptasServerService} from '../../../shared/dioptas-server.service';


describe('ImagePlotComponent', () => {
  let component: ImagePlotComponent;
  let fixture: ComponentFixture<ImagePlotComponent>;


  beforeEach(async () => {
    const dioptasService = new DioptasServerService();
    spyOn(dioptasService, 'connect');
    spyOn(dioptasService, 'getAzimuthalRing').and.returnValue(
      new Promise<{ x: any, y: any }>(resolve => {
        resolve({x: [[1, 2, 3, 4], [], [], []], y: [[5, 6, 7, 8], [], [], []]});
      }));
    spyOn(dioptasService, 'getImageAngles').and.returnValue(
      new Promise<{ tth: number, azi: number, q: number, d: number }>(resolve => {
        resolve({tth: 5, azi: 130, q: 2, d: 10});
      }));

    await TestBed.configureTestingModule({
      declarations: [ImagePlotComponent],
      providers: [
        DataGeneratorService,
        {provide: DioptasServerService, useValue: dioptasService},
        MousePositionService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the circle line items correctly', async () => {
      const mouseService = TestBed.inject(MousePositionService);
      await mouseService.anglesClicked.next({tth: 5, azi: 130, q: 2, d: 10});
      expect(component.circleLineItems[0].x).toEqual([1, 2, 3, 4]);
      expect(component.circleLineItems[0].y).toEqual([5, 6, 7, 8]);
    }
  );
});
