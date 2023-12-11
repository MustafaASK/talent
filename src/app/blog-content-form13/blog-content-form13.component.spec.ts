import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm13Component } from './blog-content-form13.component';

describe('BlogContentForm13Component', () => {
  let component: BlogContentForm13Component;
  let fixture: ComponentFixture<BlogContentForm13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm13Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
