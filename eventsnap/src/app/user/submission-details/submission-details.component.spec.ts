import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionDetailsComponent } from './submission-details.component';

describe('SubmissionDetailsComponent', () => {
  let component: SubmissionDetailsComponent;
  let fixture: ComponentFixture<SubmissionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
