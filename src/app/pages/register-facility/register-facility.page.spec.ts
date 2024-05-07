import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFacilityPage } from './register-facility.page';

describe('RegisterFacilityPage', () => {
  let component: RegisterFacilityPage;
  let fixture: ComponentFixture<RegisterFacilityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFacilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
