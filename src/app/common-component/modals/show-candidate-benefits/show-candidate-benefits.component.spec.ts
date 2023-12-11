import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCandidateBenefitsComponent } from './show-candidate-benefits.component';

describe('ShowCandidateBenefitsComponent', () => {
  let component: ShowCandidateBenefitsComponent;
  let fixture: ComponentFixture<ShowCandidateBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCandidateBenefitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCandidateBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
