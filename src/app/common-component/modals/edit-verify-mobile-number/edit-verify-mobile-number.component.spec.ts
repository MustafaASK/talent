import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVerifyMobileNumberComponent } from './edit-verify-mobile-number.component';

describe('EditVerifyMobileNumberComponent', () => {
  let component: EditVerifyMobileNumberComponent;
  let fixture: ComponentFixture<EditVerifyMobileNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVerifyMobileNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVerifyMobileNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
