import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { UserComponent } from '../user/user.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, UserComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  attendedEvents: any[] = [];
  currentDate: Date = new Date();
  eventParticipantsCount: any = {};
  userAttendanceStatus: any;
  registrationStatus: { [key: number]: string } = {};

  constructor(
    private eventsService: ApiService,
    private router: Router,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.getAttendedEvents();
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
    this.getApprovedParticipantsCount();
  }

  fetchEvents() {
    this.eventsService.getEvents().subscribe({
      next: (events: any[]) => {
        this.events = events;
        console.log('Fetched events:', this.events);
        // Now that events are fetched, fetch registration statuses
        this.fetchRegistrationStatuses();
        this.checkUserAttendance();
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }  

  checkUserAttendance() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
  
    this.events.forEach((event) => {
      this.eventsService.checkUserEventAttendance(userId, event.id).subscribe({
        next: (hasAttended) => {
          if (hasAttended) {
            this.registrationStatus[event.id] = 'Attended';
          }
        },
        error: (error) => {
          console.error('Error checking event attendance:', error);
        }
      });
    });
  }

  getAttendedEvents() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.eventsService.getEventHistory(userId).subscribe({
        next: (data) => {
          // Include all events where user has recorded attendance (pending or approved)
          this.attendedEvents = data.filter((event: any) =>
            event.status === 'pending' || event.status === 'approved'
          );
          console.log('Attended Events:', this.attendedEvents);
        },
        error: (error) => {
          console.error('Error fetching attended events:', error);
        }
      });
    }
  }

  filterAvailableEvents() {
    const userId = localStorage.getItem('userId');
    
    return this.events.filter(event => {
      // Check if user is logged in
      if (!userId) return false;
  
      // Check if event is in the past
      if (this.isPastEvent(event.event_date, event.event_end_time)) return false;
  
      // Check event availability (max participants)
      if (!this.checkEventAvailability(event)) return false;
  
      return true;
    });
  }

  getAvailableEvents(): any[] {
    return this.filterAvailableEvents();
  }

  hasAttendedEvent(eventId: string): boolean {
    return this.attendedEvents.some(event => 
      event.event_id === eventId &&
      (event.status === 'pending' || event.status === 'approved')
    );
  }

  checkEventAvailability(event: any): boolean {
    const approvedCount = this.getApprovedCount(event);
    return approvedCount < (event.max_participants || Infinity);
  }

  isEventPending(eventId: string): boolean {
    const event = this.attendedEvents.find(attendedEvent =>
      attendedEvent.event_id === eventId
    );
    return event ? event.status === 'pending' : false;
  }

  isEventApproved(eventId: string): boolean {
    const event = this.attendedEvents.find(attendedEvent =>
      attendedEvent.event_id === eventId
    );
    return event ? event.status === 'approved' : false;
  }

  isPastEvent(eventDate: string, eventEndTime: string): boolean {
    const eventEndDateTime = new Date(`${eventDate}T${eventEndTime}`).getTime();
    return eventEndDateTime < this.currentDate.getTime();
  }

  attendEvent(event: any) {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      this.snackBar.open('Please log in to attend events', 'Close', { duration: 3000 });
      return;
    }
  
    console.log('Event ID:', event.id);
    console.log('Current registration status:', this.registrationStatus[event.id]);
  
    if (this.registrationStatus[event.id] === 'Pending') {
      this.snackBar.open('You are pending for approval', 'Close', { duration: 3000 });
      return;
    }
  
    // Additional check to prevent multiple event attendance
    this.eventsService.checkUserEventAttendance(userId, event.id).subscribe({
      next: (hasAttended) => {
        if (hasAttended) {
          console.log('User has already attended this event');
          this.snackBar.open('You have already attended this event', 'Close', { duration: 3000 });
          return;
        }
  
        // Check event capacity
        const approvedCount = this.getApprovedCount(event);
        console.log('Approved participant count:', approvedCount);
        if (approvedCount >= (event.max_participants || Infinity)) {
          console.log('Event is at maximum capacity');
          this.snackBar.open('This event has reached maximum capacity', 'Close', { duration: 3000 });
          return;
        }
  
        // Proceed with event registration if all checks pass
        localStorage.setItem('selectedEvent', JSON.stringify(event));
        this.router.navigate(['/image-capture']);
      },
      error: (error) => {
        console.error('Error checking event attendance:', error);
        this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }  

  updateTime() {
    this.currentDate = new Date();
  }

  formatEventDateTime(eventDate: string, eventTime: string): string {
    const date = new Date(`${eventDate}T${eventTime}`);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  getApprovedParticipantsCount() {
    this.eventsService.getApprovedParticipantsCount().subscribe(
      (response) => {
        console.log('API Response for Approved Participants Count:', response);
        if (response.status === 'success') {
          response.data.forEach((event: any) => {
            this.eventParticipantsCount[event.event_name] = event.approved_count;
          });
        } else {
          console.error('Failed to fetch count:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching count:', error);
      }
    );
  }

  getApprovedCount(event: any): number {
    return this.eventParticipantsCount[event.event_id] || 0;
  }  

  // This method will return the appropriate button label based on the user's attendance status.
  getButtonLabel(event: any): string {
    // If the event has ended, display 'Event Ended'
    if (this.isPastEvent(event.event_date, event.event_end_time)) {
      return 'Event Ended';
    }
  
    // Check if the user has already attended the event
    const status = this.registrationStatus[event.id];
    if (status === 'Attended') {
      return 'View Submission'; // Only show this after the user has attended
    }
  
    // If the event is approved, show 'Submit Attendance'
    if (status === 'Approved') {
      return 'Submit Attendance';
    }
  
    // If the event is pending, show 'Pending Approval'
    if (status === 'Pending') {
      return 'Pending Approval';
    }

    if (status === 'Rejected') {
      return 'Cannot Attend Event';
    }
    
    // Default to 'Register' if no status is found
    return 'Register';
  }

  handleButtonClick(event: any) {
    const buttonLabel = this.getButtonLabel(event);
  
    if (buttonLabel === 'Register') {
      this.registerForEvent(event); // Register if not yet registered
    } else if (buttonLabel === 'View Submission') {
      this.viewSubmission(event); // Navigate to submission details if attended
    } else if (buttonLabel === 'Submit Attendance') {
      this.attendEvent(event); // Handle attendance submission
    } else if (buttonLabel === 'Pending Approval') {
      this.snackBar.open('Your registration is pending approval.', 'Close', { duration: 3000 });
    }
  }
  

  registerForEvent(event: any): void {
    const studentId = localStorage.getItem('userId'); // Get logged-in student's ID
    const data = { student_id: studentId, event_id: event.id };
  
    this.eventsService.registerForEvent(data).subscribe(
      (response) => {
        console.log('Event registration response:', response);
  
        // Extract the message from response.status.message
        const message = response?.status?.message || 'An unexpected error occurred.';
  
        // Display the message in the snackbar
        this.snackBar.open(message, 'Close', {
          duration: 3000, // 3 seconds
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
  
        // Check if the registration was successful and approved
        if (response.status === 'approved') {
          // Increment the approved participant count for the event
          this.eventParticipantsCount[event.event_name] = (this.eventParticipantsCount[event.event_name] || 0) + 1;
        }
  
        // Refetch the events after successful registration
        this.fetchEvents(); // Call fetchEvents to update the events list
      },
      (error) => {
        console.error('Event registration failed:', error);
  
        // Show an error message in the snackbar
        this.snackBar.open('Registration failed. Please try again.', 'Close', {
          duration: 3000, // 3 seconds
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    );
  }
  

  fetchRegistrationStatuses(): void {
    const studentId = localStorage.getItem('userId');
    if (!studentId) {
      console.warn('No student ID found in localStorage. Skipping registration status fetch.');
      return;
    }
  
    this.eventsService.getRegistrationStatus(studentId).subscribe(
      (response) => {
        console.log('API response for registration statuses:', response);
        if (response?.status?.remarks === 'success' && Array.isArray(response.payload)) {
          this.registrationStatus = {};
          response.payload.forEach((item: any) => {
            this.registrationStatus[item.event_id] = item.status; // Make sure the event_id and status are correct
          });
        } else {
          console.warn('Unexpected API response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching registration statuses:', error);
      }
    );
  }  
    
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  viewSubmission(event: any) {
    // Logic to view the user's submission
    console.log('Viewing submission for event:', event);
    // Navigate to a submission details page, or show the submission in a modal, etc.
    this.router.navigate(['/submission-details', event.id]);
  }
}