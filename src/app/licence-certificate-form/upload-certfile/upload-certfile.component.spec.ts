import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCertfileComponent } from './upload-certfile.component';

describe('UploadCertfileComponent', () => {
  let component: UploadCertfileComponent;
  let fixture: ComponentFixture<UploadCertfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCertfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCertfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
