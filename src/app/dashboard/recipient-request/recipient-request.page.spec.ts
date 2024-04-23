import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipientRequestPage } from './recipient-request.page';

describe('RecipientRequestPage', () => {
  let component: RecipientRequestPage;
  let fixture: ComponentFixture<RecipientRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
