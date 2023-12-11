import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewprepComponent } from './interviewprep.component';

describe('InterviewprepComponent', () => {
  let component: InterviewprepComponent;
  let fixture: ComponentFixture<InterviewprepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewprepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewprepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
