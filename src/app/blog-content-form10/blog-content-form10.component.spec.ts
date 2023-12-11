import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm10Component } from './blog-content-form10.component';

describe('BlogContentForm10Component', () => {
  let component: BlogContentForm10Component;
  let fixture: ComponentFixture<BlogContentForm10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm10Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
