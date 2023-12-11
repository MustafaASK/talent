import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoNotFoundComponent } from './basic-info-not-found.component';

describe('BasicInfoNotFoundComponent', () => {
  let component: BasicInfoNotFoundComponent;
  let fixture: ComponentFixture<BasicInfoNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicInfoNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfoNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
