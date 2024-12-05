import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAttendedEventsComponent } from './users-attended-events.component';

describe('UsersAttendedEventsComponent', () => {
  let component: UsersAttendedEventsComponent;
  let fixture: ComponentFixture<UsersAttendedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersAttendedEventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersAttendedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
