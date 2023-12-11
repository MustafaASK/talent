import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyJobAppliedComponent } from './already-job-applied.component';

describe('AlreadyJobAppliedComponent', () => {
  let component: AlreadyJobAppliedComponent;
  let fixture: ComponentFixture<AlreadyJobAppliedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlreadyJobAppliedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyJobAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
