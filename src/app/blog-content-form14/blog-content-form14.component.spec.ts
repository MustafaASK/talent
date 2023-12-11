import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm14Component } from './blog-content-form14.component';

describe('BlogContentForm14Component', () => {
  let component: BlogContentForm14Component;
  let fixture: ComponentFixture<BlogContentForm14Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm14Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
