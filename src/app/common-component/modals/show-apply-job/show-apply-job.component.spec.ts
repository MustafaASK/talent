import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowApplyJobComponent } from './show-apply-job.component';

describe('ShowApplyJobComponent', () => {
  let component: ShowApplyJobComponent;
  let fixture: ComponentFixture<ShowApplyJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowApplyJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowApplyJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
