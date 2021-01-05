import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathDialogComponent } from './path-dialog.component';

describe('OpenProjectDialogComponent', () => {
  let component: PathDialogComponent;
  let fixture: ComponentFixture<PathDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
