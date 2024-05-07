import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityFeedBackPage } from './facility-feed-back.page';

describe('FacilityFeedBackPage', () => {
  let component: FacilityFeedBackPage;
  let fixture: ComponentFixture<FacilityFeedBackPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityFeedBackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
