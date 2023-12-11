import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanksForApplyingComponent } from './thanks-for-applying.component';

describe('ThanksForApplyingComponent', () => {
  let component: ThanksForApplyingComponent;
  let fixture: ComponentFixture<ThanksForApplyingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThanksForApplyingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanksForApplyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
