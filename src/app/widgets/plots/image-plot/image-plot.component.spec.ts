import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePlotComponent } from './image-plot.component';

describe('ImagePlotComponent', () => {
  let component: ImagePlotComponent;
  let fixture: ComponentFixture<ImagePlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagePlotComponent ]
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
});
