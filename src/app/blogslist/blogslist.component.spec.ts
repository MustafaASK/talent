import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogslistComponent } from './blogslist.component';

describe('BlogslistComponent', () => {
  let component: BlogslistComponent;
  let fixture: ComponentFixture<BlogslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
