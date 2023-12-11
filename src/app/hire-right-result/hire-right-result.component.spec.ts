import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireRightResultComponent } from './hire-right-result.component';

describe('HireRightResultComponent', () => {
  let component: HireRightResultComponent;
  let fixture: ComponentFixture<HireRightResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HireRightResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HireRightResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
