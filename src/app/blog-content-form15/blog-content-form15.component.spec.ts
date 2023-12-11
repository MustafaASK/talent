import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm15Component } from './blog-content-form15.component';

describe('BlogContentForm15Component', () => {
  let component: BlogContentForm15Component;
  let fixture: ComponentFixture<BlogContentForm15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm15Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
