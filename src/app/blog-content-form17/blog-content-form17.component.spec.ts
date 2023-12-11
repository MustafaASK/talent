import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm17Component } from './blog-content-form17.component';

describe('BlogContentForm17Component', () => {
  let component: BlogContentForm17Component;
  let fixture: ComponentFixture<BlogContentForm17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
