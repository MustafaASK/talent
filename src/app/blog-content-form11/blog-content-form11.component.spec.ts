import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm11Component } from './blog-content-form11.component';

describe('BlogContentForm11Component', () => {
  let component: BlogContentForm11Component;
  let fixture: ComponentFixture<BlogContentForm11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm11Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
