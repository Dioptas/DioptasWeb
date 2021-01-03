import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationFooterComponent } from './integration-footer.component';

describe('IntegrationFooterComponent', () => {
  let component: IntegrationFooterComponent;
  let fixture: ComponentFixture<IntegrationFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationFooterComponent ]
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
});
