import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm2Component } from './blog-content-form2.component';

describe('BlogContentForm2Component', () => {
  let component: BlogContentForm2Component;
  let fixture: ComponentFixture<BlogContentForm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
