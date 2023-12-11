import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentForm4Component } from './blog-content-form4.component';

describe('BlogContentForm4Component', () => {
  let component: BlogContentForm4Component;
  let fixture: ComponentFixture<BlogContentForm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogContentForm4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogContentForm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
