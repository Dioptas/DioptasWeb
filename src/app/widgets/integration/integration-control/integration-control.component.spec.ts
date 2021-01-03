import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationControlComponent } from './integration-control.component';

describe('IntegrationControlComponent', () => {
  let component: IntegrationControlComponent;
  let fixture: ComponentFixture<IntegrationControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
