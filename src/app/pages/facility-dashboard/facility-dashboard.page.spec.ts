import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityDashboardPage } from './facility-dashboard.page';

describe('FacilityDashboardPage', () => {
  let component: FacilityDashboardPage;
  let fixture: ComponentFixture<FacilityDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
