import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PatternPlotComponent} from './pattern-plot.component';
import {ServerService} from '../../../shared/model/server.service';
import {PatternService} from '../../../shared/model/pattern.service';
import {CalibrationService} from '../../../shared/model/calibration.service';
import {MousePositionService} from '../../../shared/mouse/mouse-position.service';
import {OverlayService} from '../../../shared/model/overlay.service';

describe('PatternPlotComponent', () => {
  let component: PatternPlotComponent;
  let fixture: ComponentFixture<PatternPlotComponent>;

  beforeEach(async () => {
    spyOn(ServerService.prototype, 'connect');
    spyOn(PatternService.prototype, 'connectSioEvents');
    spyOn(CalibrationService.prototype, 'getPatternAngles').and.returnValue(
      new Promise<{ tth: number, azi: number, q: number, d: number }>(resolve => {
        resolve({tth: 5, azi: 130, q: 2, d: 10});
      }));


    await TestBed.configureTestingModule({
      declarations: [PatternPlotComponent],
      providers: [
        PatternService,
        CalibrationService,
        OverlayService,
        MousePositionService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should plot the correct mainLine item', async () => {
    const patternService = TestBed.inject(PatternService);
    await patternService.integratedPattern.next({x: [1, 2, 3, 4], y: [2, 3, 4, 5]});
    expect(component.mainLine.x).toEqual([1, 2, 3, 4]);
    expect(component.mainLine.y).toEqual([2, 3, 4, 5]);
  });

  it('should plot overlay items', async () => {
    const overlayService = TestBed.inject(OverlayService);
    await overlayService.overlays.next([]);
    expect(component.overlays.length).toEqual(0);
    await overlayService.overlays.next(
      [
        {
          name: 'Herbert',
          x: [0, 5, 10, 15, 20, 25, 40],
          y: [0, 100, 1000, 150, 2000, 5000, 3500],
          visible: true,
          color: '#ed1212',
          scaling: 1,
          offset: 0
        },
        {
          name: 'Tante Frida',
          x: [0, 5, 10, 15, 20, 25],
          y: [0, 300, 740, 450, 3000, -500],
          visible: true,
          color: '#24ff16',
          scaling: 2,
          offset: 100
        }]
    );
    expect(component.overlays.length).toEqual(2);
  });
});
