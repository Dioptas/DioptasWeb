import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabeledNumberComponent } from './labeled-number.component';

describe('LabeledNumberComponent', () => {
  let component: LabeledNumberComponent;
  let fixture: ComponentFixture<LabeledNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabeledNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabeledNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
