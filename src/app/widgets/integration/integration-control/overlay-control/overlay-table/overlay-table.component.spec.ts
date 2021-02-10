import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayTableComponent } from './overlay-table.component';

describe('OverlayTableComponent', () => {
  let component: OverlayTableComponent;
  let fixture: ComponentFixture<OverlayTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
