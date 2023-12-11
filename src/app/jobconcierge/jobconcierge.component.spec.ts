import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobconciergeComponent } from './jobconcierge.component';

describe('JobconciergeComponent', () => {
  let component: JobconciergeComponent;
  let fixture: ComponentFixture<JobconciergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobconciergeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobconciergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
