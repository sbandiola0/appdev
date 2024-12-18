import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstudentComponent } from './adminstudent.component';

describe('AdminstudentComponent', () => {
  let component: AdminstudentComponent;
  let fixture: ComponentFixture<AdminstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminstudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
