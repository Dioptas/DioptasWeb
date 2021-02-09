import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PatternPlotComponent} from './pattern-plot.component';
import {DioptasServerService} from '../../../shared/dioptas-server.service';
import {MousePositionService} from '../../../shared/mouse-position.service';

describe('PatternPlotComponent', () => {
  let component: PatternPlotComponent;
  let fixture: ComponentFixture<PatternPlotComponent>;

  beforeEach(async () => {
    spyOn(DioptasServerService.prototype, 'connect');
    const dioptasService = new DioptasServerService();
    spyOn(dioptasService, 'getPatternAngles').and.returnValue(
      new Promise<{ tth: number, azi: number, q: number, d: number }>(resolve => {
        resolve({tth: 5, azi: 130, q: 2, d: 10});
      }));


    await TestBed.configureTestingModule({
      declarations: [PatternPlotComponent],
      providers: [
        {provide: DioptasServerService, useValue: dioptasService},
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
    const dioptasService = TestBed.inject(DioptasServerService);
    await dioptasService.integratedPattern.next({x: [1, 2, 3, 4], y: [2, 3, 4, 5]});
    expect(component.mainLine.x).toEqual([1, 2, 3, 4]);
    expect(component.mainLine.y).toEqual([2, 3, 4, 5]);
  });
});
