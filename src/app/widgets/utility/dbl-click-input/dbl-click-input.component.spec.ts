import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DblClickInputComponent } from './dbl-click-input.component';

describe('DblClickInputComponent', () => {
  let component: DblClickInputComponent;
  let fixture: ComponentFixture<DblClickInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DblClickInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DblClickInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
