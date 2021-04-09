import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OverlayControlComponent} from './overlay-control.component';
import {ServerService} from '../../../../shared/model/server.service';
import {OverlayService} from '../../../../shared/model/overlay.service';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {OverlayTableComponent} from './overlay-table/overlay-table.component';
import {OverlayTableItemComponent} from './overlay-table-item/overlay-table-item.component';
import {DblClickInputComponent} from '../../../utility/dbl-click-input/dbl-click-input.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

describe('OverlayControlComponent', () => {
  let component: OverlayControlComponent;
  let fixture: ComponentFixture<OverlayControlComponent>;

  beforeEach(async () => {
    spyOn(ServerService.prototype, 'connect');
    const serverService = new ServerService();
    const overlayService = new OverlayService(serverService);

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule, MatCheckboxModule],
      declarations: [OverlayControlComponent, OverlayTableComponent, OverlayTableItemComponent, DblClickInputComponent],
      providers: [
        {provide: ServerService, useValue: serverService},
        {provide: OverlayService, useValue: overlayService}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a menu, list and options', () => {
    const el = fixture.nativeElement;
    expect(el.querySelector('.menu')).toBeTruthy();
    expect(el.querySelector('.overlay-list')).toBeTruthy();
    expect(el.querySelector('.options')).toBeTruthy();
  });

  it('should show correct menu items in menu', () => {
    const menu = fixture.nativeElement.querySelector('.menu');
    expect(menu.querySelector('button.open')).toBeTruthy();
    expect(menu.querySelector('button.delete')).toBeTruthy();
    expect(menu.querySelector('button.reset')).toBeTruthy();
    expect(menu.querySelector('button.up')).toBeTruthy();
    expect(menu.querySelector('button.down')).toBeTruthy();
  });

  it('should show several overlay in the list', () => {
    const list = fixture.nativeElement.querySelector('.overlay-list');
    const overlayItems = list.querySelectorAll('.overlay-item');
    expect(overlayItems.length).toBeGreaterThan(0);
  });
});
