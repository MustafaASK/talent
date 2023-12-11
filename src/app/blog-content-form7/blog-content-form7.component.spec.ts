import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm7Component } from './blog-content-form7.component';

describe('BlogContentForm7Component', () => {
  let component: BlogContentForm7Component;
  let fixture: ComponentFixture<BlogContentForm7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm7Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
