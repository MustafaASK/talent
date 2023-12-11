import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HirerightformComponent } from './hirerightform.component';

describe('HirerightformComponent', () => {
  let component: HirerightformComponent;
  let fixture: ComponentFixture<HirerightformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HirerightformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HirerightformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
