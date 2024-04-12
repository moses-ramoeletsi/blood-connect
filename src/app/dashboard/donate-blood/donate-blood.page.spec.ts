import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonateBloodPage } from './donate-blood.page';

describe('DonateBloodPage', () => {
  let component: DonateBloodPage;
  let fixture: ComponentFixture<DonateBloodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateBloodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
