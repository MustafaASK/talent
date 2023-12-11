import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm18Component } from './blog-content-form18.component';

describe('BlogContentForm18Component', () => {
  let component: BlogContentForm18Component;
  let fixture: ComponentFixture<BlogContentForm18Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm18Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
