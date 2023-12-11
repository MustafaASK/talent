import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm12Component } from './blog-content-form12.component';

describe('BlogContentForm12Component', () => {
  let component: BlogContentForm12Component;
  let fixture: ComponentFixture<BlogContentForm12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm12Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
