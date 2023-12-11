import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm19Component } from './blog-content-form19.component';

describe('BlogContentForm19Component', () => {
  let component: BlogContentForm19Component;
  let fixture: ComponentFixture<BlogContentForm19Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm19Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm19Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
