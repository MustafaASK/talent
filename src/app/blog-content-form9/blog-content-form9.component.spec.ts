import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm9Component } from './blog-content-form9.component';

describe('BlogContentForm9Component', () => {
  let component: BlogContentForm9Component;
  let fixture: ComponentFixture<BlogContentForm9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm9Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
