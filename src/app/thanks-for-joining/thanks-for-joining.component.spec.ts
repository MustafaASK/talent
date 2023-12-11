import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanksForJoiningComponent } from './thanks-for-joining.component';

describe('ThanksForJoiningComponent', () => {
  let component: ThanksForJoiningComponent;
  let fixture: ComponentFixture<ThanksForJoiningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThanksForJoiningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanksForJoiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
