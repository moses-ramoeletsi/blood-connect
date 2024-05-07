import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityPostEventsPage } from './facility-post-events.page';

describe('FacilityPostEventsPage', () => {
  let component: FacilityPostEventsPage;
  let fixture: ComponentFixture<FacilityPostEventsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityPostEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
