import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerssubformComponent } from './employerssubform.component';

describe('EmployerssubformComponent', () => {
  let component: EmployerssubformComponent;
  let fixture: ComponentFixture<EmployerssubformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerssubformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerssubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
