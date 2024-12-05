import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventModalComponent } from './add-event-modal.component';

describe('AddEventModalComponent', () => {
  let component: AddEventModalComponent;
  let fixture: ComponentFixture<AddEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
