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
        ServerService,
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
});
