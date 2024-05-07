import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityDonateBloodPage } from './facility-donate-blood.page';

describe('FacilityDonateBloodPage', () => {
  let component: FacilityDonateBloodPage;
  let fixture: ComponentFixture<FacilityDonateBloodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityDonateBloodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
