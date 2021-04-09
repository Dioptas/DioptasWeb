import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternTopMenuComponent } from './pattern-top-menu.component';

describe('PatternTopMenuComponent', () => {
  let component: PatternTopMenuComponent;
  let fixture: ComponentFixture<PatternTopMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternTopMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
