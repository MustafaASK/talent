import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm1Component } from './blog-content-form1.component';

describe('BlogContentForm1Component', () => {
  let component: BlogContentForm1Component;
  let fixture: ComponentFixture<BlogContentForm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
