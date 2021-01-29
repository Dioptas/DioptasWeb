import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternPlotPlotlyComponent } from './pattern-plot-plotly.component';

describe('pattern-plot-plotly', () => {
  let component: PatternPlotPlotlyComponent;
  let fixture: ComponentFixture<PatternPlotPlotlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternPlotPlotlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternPlotPlotlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
