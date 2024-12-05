import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { EventService } from '../../../services/event.service';
import { ApiService } from '../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-event-modal',
  standalone: true,
  imports: [MatFormField, MatFormFieldModule, FormsModule, MatInputModule, MatInput, ReactiveFormsModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './add-event-modal.component.html',
  styleUrl: './add-event-modal.component.css'
})
export class AddEventModalComponent {
  isModalOpen = true;
  addEventForm: FormGroup;

  constructor(private fb: FormBuilder, private eventService: ApiService, private snackBar: MatSnackBar, private router: Router) {
    this.addEventForm = this.fb.group({
      event_name: ['', Validators.required],
      school_name: ['', Validators.required],
      event_date: ['', Validators.required],
      event_start_time: ['', Validators.required],
      event_end_time: ['', Validators.required],
      exclusive_for: ['', Validators.required],
      max_participants: ['', Validators.required] // New form control
    });
  }

  onAdd() {
    if (this.addEventForm.valid) {
      const formData = this.addEventForm.value;

      this.eventService.addEvent(formData).subscribe({
        next: (response) => {
          if (response.status.remarks === 'success') { 
            this.snackBar.open('Event added successfully.', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Failed to add event.', 'Close', { duration: 3000 });
            console.error('Failed to add event:', response.status.message);
          }
          // Redirect to /event after handling response
          this.router.navigate(['/event']);
        },
        error: (err) => {
          console.error('Error adding event:', err);
          this.snackBar.open('Error adding event.', 'Close', { duration: 3000 });
          // Redirect to /event after handling error
          this.router.navigate(['/event']);
        }
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }
}