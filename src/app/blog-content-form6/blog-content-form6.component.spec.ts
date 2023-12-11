import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm6Component } from './blog-content-form6.component';

describe('BlogContentForm6Component', () => {
  let component: BlogContentForm6Component;
  let fixture: ComponentFixture<BlogContentForm6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm6Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
