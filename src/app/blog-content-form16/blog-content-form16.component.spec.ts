import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm16Component } from './blog-content-form16.component';

describe('BlogContentForm16Component', () => {
  let component: BlogContentForm16Component;
  let fixture: ComponentFixture<BlogContentForm16Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm16Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
