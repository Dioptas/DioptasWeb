import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalSplitterComponent } from './horizontal-splitter.component';

describe('HorizontalSplitterComponent', () => {
  let component: HorizontalSplitterComponent;
  let fixture: ComponentFixture<HorizontalSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorizontalSplitterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
