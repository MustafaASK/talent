import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceCertificateFormComponent } from './licence-certificate-form.component';

describe('LicenceCertificateFormComponent', () => {
  let component: LicenceCertificateFormComponent;
  let fixture: ComponentFixture<LicenceCertificateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenceCertificateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceCertificateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
