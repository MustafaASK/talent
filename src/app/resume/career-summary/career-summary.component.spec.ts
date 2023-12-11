import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerSummaryComponent } from './career-summary.component';

describe('CareerSummaryComponent', () => {
  let component: CareerSummaryComponent;
  let fixture: ComponentFixture<CareerSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
