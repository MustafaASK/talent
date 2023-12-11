import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLinkFormComponent } from './social-link-form.component';

describe('SocialLinkFormComponent', () => {
  let component: SocialLinkFormComponent;
  let fixture: ComponentFixture<SocialLinkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialLinkFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
