import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayTableItemComponent } from './overlay-table-item.component';
import Overlay from '../../../../../shared/overlay';

describe('OverlayTableItemComponent', () => {
  let component: OverlayTableItemComponent;
  let fixture: ComponentFixture<OverlayTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayTableItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayTableItemComponent);
    component = fixture.componentInstance;
    component.overlayItem = new Overlay();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
