import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';

import {ImageControlComponent} from './image-control.component';
import {DioptasServerService} from '../../../../shared/model/dioptas-server.service';
import {BehaviorSubject, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatInputHarness} from '@angular/material/input/testing';

describe('ImageControlComponent', () => {
  let component: ImageControlComponent;
  let fixture: ComponentFixture<ImageControlComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {

    const dioptasServiceSpy = jasmine.createSpyObj(
      'DioptasServerService',
      ['load_dummy_model', 'load_next_image'],
      ['imageFilename']
    );
    spyPropertyGetter(dioptasServiceSpy, 'imageFilename').and.returnValue(new BehaviorSubject<string>(
      'test1/test2/image.tif'));


    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue({afterClosed: () => of({action: true})});

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatCardModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule],
      declarations: [ImageControlComponent],
      providers: [
        {provide: MatDialog, useValue: matDialogSpy},
        {provide: DioptasServerService, useValue: dioptasServiceSpy}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageControlComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get filename and directory from dioptas service', () => {
    expect(component.imageFilename).toBe('image.tif');
    expect(component.imageDirectory).toBe('test1/test2');
  });

  it('should display the correct filename', async () => {
    const filePathLoader = await loader.getChildLoader('#filePath');
    const formFields = await filePathLoader.getAllHarnesses(MatFormFieldHarness);
    const input = await formFields[0].getControl() as MatInputHarness;
    const value = await input.getValue();
    expect(value).toBe('image.tif');
  });

  it('should display the correct directory', async () => {
    const filePathLoader = await loader.getChildLoader('#filePath');
    const formFields = await filePathLoader.getAllHarnesses(MatFormFieldHarness);
    const input = await formFields[1].getControl() as MatInputHarness;
    const value = await input.getValue();
    expect(value).toBe('test1/test2');
  });
});

function spyPropertyGetter(spyObj: jasmine.SpyObj<any>, propName: string): jasmine.Spy<jasmine.Func> {
  return Object.getOwnPropertyDescriptor(spyObj, propName).get as jasmine.Spy<jasmine.Func>;
}

