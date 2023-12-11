import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm8Component } from './blog-content-form8.component';

describe('BlogContentForm8Component', () => {
  let component: BlogContentForm8Component;
  let fixture: ComponentFixture<BlogContentForm8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm8Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
