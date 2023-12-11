import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncredibleresumeComponent } from './incredibleresume.component';

describe('IncredibleresumeComponent', () => {
  let component: IncredibleresumeComponent;
  let fixture: ComponentFixture<IncredibleresumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncredibleresumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncredibleresumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
