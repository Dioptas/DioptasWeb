import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IntegrationFooterComponent} from './integration-footer.component';
import {BehaviorSubject} from 'rxjs';
import {MousePositionService} from '../../../shared/mouse-position.service';
import {AnglesComponent} from './angles/angles.component';
import {ImagePositionComponent} from './image-position/image-position.component';
import {PatternPositionComponent} from './pattern-position/pattern-position.component';
import {LabeledNumberComponent} from '../../utility/labeled-number/labeled-number.component';
import {MatToolbarModule} from '@angular/material/toolbar';

describe('IntegrationFooterComponent', () => {
  let component: IntegrationFooterComponent;
  let fixture: ComponentFixture<IntegrationFooterComponent>;

  beforeEach(async () => {
    const mouseServiceSpy = jasmine.createSpyObj(
      'MousePositionService',
      ['updateImageClickPosition'],
      [
        'imageMousePosition',
        'imageClickPosition',
        'patternMousePosition',
        'patternClickPosition',
        'angles',
        'anglesClicked'
      ]);

    spyPropertyGetter(mouseServiceSpy, 'imageMousePosition')
      .and.returnValue(new BehaviorSubject<{ x: number, y: number, intensity: number }>(
      {x: 10, y: 11, intensity: 100}));
    spyPropertyGetter(mouseServiceSpy, 'imageClickPosition')
      .and.returnValue(new BehaviorSubject<{ x: number, y: number, intensity: number }>(
      {x: 13, y: 14, intensity: 200}));

    spyPropertyGetter(mouseServiceSpy, 'patternMousePosition')
      .and.returnValue(new BehaviorSubject<{ x: number, y: number }>(
      {x: 20, y: 21}));
    spyPropertyGetter(mouseServiceSpy, 'patternClickPosition')
      .and.returnValue(new BehaviorSubject<{ x: number, y: number }>(
      {x: 23, y: 24}));

    spyPropertyGetter(mouseServiceSpy, 'angles')
      .and.returnValue(new BehaviorSubject<{ tth: number, azi: number, q: number, d: number }>(
      {tth: 33, azi: 130, q: 5, d: 2}));
    spyPropertyGetter(mouseServiceSpy, 'anglesClicked')
      .and.returnValue(new BehaviorSubject<{ tth: number, azi: number, q: number, d: number }>(
      {tth: 43, azi: 120, q: 8, d: 1}));

    await TestBed.configureTestingModule({
      imports: [MatToolbarModule],
      declarations: [IntegrationFooterComponent, AnglesComponent, ImagePositionComponent, PatternPositionComponent, LabeledNumberComponent],
      providers: [
        {provide: MousePositionService, useValue: mouseServiceSpy},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the image MousePosition', (done: DoneFn) => {
    component.imageMousePosition.subscribe((value) => {
      expect(value.x).toBe(10);
      expect(value.y).toBe(11);
      expect(value.intensity).toBe(100);
      done();
    });
  });

  it('should update the image ClickPosition', (done: DoneFn) => {
    component.imageClickPosition.subscribe((value) => {
      expect(value.x).toBe(13);
      expect(value.y).toBe(14);
      expect(value.intensity).toBe(200);
      done();
    });
  });

  it('should update the pattern MousePosition', (done: DoneFn) => {
    component.patternMousePosition.subscribe((value) => {
      expect(value.x).toBe(20);
      expect(value.y).toBe(21);
      done();
    });
  });

  it('should update the pattern ClickPosition', (done: DoneFn) => {
    component.patternClickPosition.subscribe((value) => {
      expect(value.x).toBe(23);
      expect(value.y).toBe(24);
      done();
    });
  });

  it('should update the angles', (done: DoneFn) => {
    component.angles.subscribe((value) => {
      expect(value.tth).toBe(33);
      expect(value.azi).toBe(130);
      expect(value.q).toBe(5);
      expect(value.d).toBe(2);
      done();
    });
  });

  it('should update the click Angles', (done: DoneFn) => {
    component.clickAngles.subscribe((value) => {
      expect(value.tth).toBe(43);
      expect(value.azi).toBe(120);
      expect(value.q).toBe(8);
      expect(value.d).toBe(1);
      done();
    });
  });
});

function spyPropertyGetter(spyObj: jasmine.SpyObj<any>, propName: string): jasmine.Spy<jasmine.Func> {
  return Object.getOwnPropertyDescriptor(spyObj, propName).get as jasmine.Spy<jasmine.Func>;
}

