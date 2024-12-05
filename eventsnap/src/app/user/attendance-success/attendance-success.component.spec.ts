import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceSuccessComponent } from './attendance-success.component';

describe('AttendanceSuccessComponent', () => {
  let component: AttendanceSuccessComponent;
  let fixture: ComponentFixture<AttendanceSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceSuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendanceSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
