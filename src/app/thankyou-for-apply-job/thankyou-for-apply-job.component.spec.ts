import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouForApplyJobComponent } from './thankyou-for-apply-job.component';

describe('ThankyouForApplyJobComponent', () => {
  let component: ThankyouForApplyJobComponent;
  let fixture: ComponentFixture<ThankyouForApplyJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThankyouForApplyJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankyouForApplyJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
