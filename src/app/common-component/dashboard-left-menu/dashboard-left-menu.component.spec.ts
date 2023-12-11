import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLeftMenuComponent } from './dashboard-left-menu.component';

describe('DashboardLeftMenuComponent', () => {
  let component: DashboardLeftMenuComponent;
  let fixture: ComponentFixture<DashboardLeftMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLeftMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
