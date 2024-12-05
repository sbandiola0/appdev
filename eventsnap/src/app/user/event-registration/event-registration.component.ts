import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css']
})
export class EventRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  selectedEvent: any;
  userData: any;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      course: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('EventRegistrationComponent initialized');
    this.loadEventData();
  }

  private loadEventData() {
    const eventData = localStorage.getItem('selectedEvent');
    console.log('Retrieved event data:', eventData);

    if (!eventData) {
      console.error('No event data found in localStorage');
      this.snackBar.open('No event selected', 'Close', { duration: 3000 });
      this.router.navigate(['/events']);
      return;
    }

    try {
      this.selectedEvent = JSON.parse(eventData);
      console.log('Parsed selected event:', this.selectedEvent);
      
      this.userData = this.authService.getLoggedInUserData();
      console.log('User data:', this.userData);

      if (this.userData) {
        this.prefillForm();
      }
    } catch (error) {
      console.error('Error parsing event data:', error);
      this.snackBar.open('Error loading event data', 'Close', { duration: 3000 });
      this.router.navigate(['/events']);
    }
  }

  private prefillForm() {
    this.registrationForm.patchValue({
      firstName: this.userData.firstName || '',
      lastName: this.userData.lastName || '',
      email: this.userData.email || '',
      course: this.userData.course || ''
    });
    console.log('Form prefilled with values:', this.registrationForm.value);
  }

  onSubmit() {
    console.log('Form submitted. Valid:', this.registrationForm.valid);
    console.log('Form values:', this.registrationForm.value);

    if (this.registrationForm.valid) {
      this.isLoading = true;
      
      try {
        const registrationData = {
          ...this.registrationForm.value,
          event_id: this.selectedEvent.id,
          event_name: this.selectedEvent.event_name,
          event_date: this.selectedEvent.event_date,
          student_id: this.userData?.id
        };

        console.log('Saving registration data:', registrationData);
        
        // Store data in localStorage
        localStorage.setItem('attendanceData', JSON.stringify(registrationData));
        localStorage.setItem('userFirstName', this.registrationForm.get('firstName')?.value);
        localStorage.setItem('userLastName', this.registrationForm.get('lastName')?.value);

        console.log('Attempting navigation to image-capture...');
        
        // Use async/await for better control over navigation
        this.navigateToImageCapture();
      } catch (error) {
        console.error('Error in form submission:', error);
        this.isLoading = false;
        this.snackBar.open('Error processing registration', 'Close', { duration: 3000 });
      }
    } else {
      console.log('Form is invalid');
      this.markFormFieldsAsTouched();
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  private async navigateToImageCapture() {
    try {
      const result = await this.router.navigate(['/image-capture']);
      console.log('Navigation result:', result);
      
      if (!result) {
        throw new Error('Navigation failed');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      this.snackBar.open('Error navigating to image capture', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  private markFormFieldsAsTouched() {
    Object.keys(this.registrationForm.controls).forEach(field => {
      const control = this.registrationForm.get(field);
      control?.markAsTouched();
    });
  }

  goBack() {
    this.router.navigate(['/events']);
  }
}