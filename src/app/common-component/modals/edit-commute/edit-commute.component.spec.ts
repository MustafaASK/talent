import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommuteComponent } from './edit-commute.component';

describe('EditCommuteComponent', () => {
    let component: EditCommuteComponent;
    let fixture: ComponentFixture<EditCommuteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditCommuteComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditCommuteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
