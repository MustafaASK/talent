import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedEmailContinueApplyComponent } from './verified-email-continue-apply.component';

describe('VerifiedEmailContinueApplyComponent', () => {
  let component: VerifiedEmailContinueApplyComponent;
  let fixture: ComponentFixture<VerifiedEmailContinueApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifiedEmailContinueApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedEmailContinueApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
