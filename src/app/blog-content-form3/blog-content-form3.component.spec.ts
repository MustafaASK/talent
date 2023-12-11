import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm3Component } from './blog-content-form3.component';

describe('BlogContentForm3Component', () => {
  let component: BlogContentForm3Component;
  let fixture: ComponentFixture<BlogContentForm3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
