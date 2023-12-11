import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm5Component } from './blog-content-form5.component';

describe('BlogContentForm5Component', () => {
  let component: BlogContentForm5Component;
  let fixture: ComponentFixture<BlogContentForm5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm5Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
