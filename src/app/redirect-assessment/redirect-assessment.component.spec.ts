import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectAssessmentComponent } from './redirect-assessment.component';

describe('RedirectAssessmentComponent', () => {
  let component: RedirectAssessmentComponent;
  let fixture: ComponentFixture<RedirectAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
