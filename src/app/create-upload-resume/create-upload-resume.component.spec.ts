import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUploadResumeComponent } from './create-upload-resume.component';

describe('CreateUploadResumeComponent', () => {
  let component: CreateUploadResumeComponent;
  let fixture: ComponentFixture<CreateUploadResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUploadResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUploadResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
