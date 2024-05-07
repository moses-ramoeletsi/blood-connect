import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityRequestsPage } from './facility-requests.page';

describe('FacilityRequestsPage', () => {
  let component: FacilityRequestsPage;
  let fixture: ComponentFixture<FacilityRequestsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
