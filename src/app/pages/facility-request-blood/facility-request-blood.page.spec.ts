import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityRequestBloodPage } from './facility-request-blood.page';

describe('FacilityRequestBloodPage', () => {
  let component: FacilityRequestBloodPage;
  let fixture: ComponentFixture<FacilityRequestBloodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityRequestBloodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
