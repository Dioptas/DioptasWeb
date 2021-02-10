import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OverlayControlComponent} from './overlay-control.component';
import {DioptasServerService} from '../../../../shared/dioptas-server.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

describe('OverlayControlComponent', () => {
  let component: OverlayControlComponent;
  let fixture: ComponentFixture<OverlayControlComponent>;

  beforeEach(async () => {
    spyOn(DioptasServerService.prototype, 'connect');
    const dioptasService = new DioptasServerService();

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule],
      declarations: [OverlayControlComponent],
      providers: [
        {provide: DioptasServerService, useValue: dioptasService}
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
