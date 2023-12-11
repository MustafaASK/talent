import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinSuccessComponent } from './linkedin-success.component';

describe('LinkedinSuccessComponent', () => {
  let component: LinkedinSuccessComponent;
  let fixture: ComponentFixture<LinkedinSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedinSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
