import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplyResumeComponent } from './job-apply-resume.component';

describe('JobApplyResumeComponent', () => {
  let component: JobApplyResumeComponent;
  let fixture: ComponentFixture<JobApplyResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobApplyResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplyResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
