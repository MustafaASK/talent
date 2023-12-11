import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpskillReskillComponent } from './upskill-reskill.component';

describe('UpskillReskillComponent', () => {
  let component: UpskillReskillComponent;
  let fixture: ComponentFixture<UpskillReskillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpskillReskillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpskillReskillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
