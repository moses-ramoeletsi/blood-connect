import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestBloodPage } from './request-blood.page';

describe('RequestBloodPage', () => {
  let component: RequestBloodPage;
  let fixture: ComponentFixture<RequestBloodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestBloodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
