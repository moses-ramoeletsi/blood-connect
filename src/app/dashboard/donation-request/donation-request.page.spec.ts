import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonationRequestPage } from './donation-request.page';

describe('DonationRequestPage', () => {
  let component: DonationRequestPage;
  let fixture: ComponentFixture<DonationRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
