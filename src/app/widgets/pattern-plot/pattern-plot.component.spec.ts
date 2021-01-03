import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternPlotComponent } from './pattern-plot.component';

describe('PlotlyExampleComponent', () => {
  let component: PatternPlotComponent;
  let fixture: ComponentFixture<PatternPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternPlotComponent ]
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
});
