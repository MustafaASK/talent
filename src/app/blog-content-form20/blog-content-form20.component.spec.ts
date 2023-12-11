import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm20Component } from './blog-content-form20.component';

describe('BlogContentForm20Component', () => {
  let component: BlogContentForm20Component;
  let fixture: ComponentFixture<BlogContentForm20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm20Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
