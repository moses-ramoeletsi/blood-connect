import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityDonationPage } from './facility-donation.page';

describe('FacilityDonationPage', () => {
  let component: FacilityDonationPage;
  let fixture: ComponentFixture<FacilityDonationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityDonationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
