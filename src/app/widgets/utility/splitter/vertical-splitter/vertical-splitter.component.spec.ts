import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalSplitterComponent } from './vertical-splitter.component';

describe('VerticalSplitterComponent', () => {
  let component: VerticalSplitterComponent;
  let fixture: ComponentFixture<VerticalSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalSplitterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
