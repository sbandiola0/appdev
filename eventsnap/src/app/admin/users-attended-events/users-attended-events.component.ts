import { Component, NgModule, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { AdminComponent } from '../admin/admin.component';
import { RouterLink, RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

interface EventInfo {
  event_name: string;
  event_date: string;
}

@Component({
  selector: 'app-users-attended-events',
  standalone: true,
  imports: [
    MatPaginator,
    MatIconModule,
    MatIconAnchor,
    MatIconButton,
    MatTableModule,
    AdminComponent,
    RouterModule,
    RouterLink,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
    // MatCardModule
  ],
  templateUrl: './users-attended-events.component.html',
  styleUrl: './users-attended-events.component.css'
})


export class UsersAttendedEventsComponent implements OnInit {
  pendingColumns: string[] = ['student_id', 'last_name', 'first_name', 'program', 'timestamp', 'image', 'actions'];
  approvedColumns: string[] = ['student_id', 'last_name', 'first_name', 'program', 'timestamp', 'image'];
  dataSource = new MatTableDataSource<any>([]);
  pageSizeOptions = [5, 10, 20];
  approvedDataSource = new MatTableDataSource<any>([]);

  // pageSizeOptions = [5, 10, 20];
  uniqueEvents: EventInfo[] = [];
  allEvents: EventInfo[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginator reference
  @ViewChild(MatSort) sort!: MatSort; // Sort reference
  @ViewChild('approvedPaginator') approvedPaginator!: MatPaginator;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchAttendance();
    this.fetchApprovedParticipants();
    this.fetchEvents();
  }

  fetchEvents() {
    this.apiService.getEvents().subscribe({
      next: (events: any[]) => {
        console.log('Raw Events Response:', events);
  
        if (!events || events.length === 0) {
          console.warn('NO EVENTS: Empty or null response received');
          this.snackBar.open('No events found in database', 'Close', { duration: 3000 });
          return;
        }
  
        this.allEvents = events.map(event => ({
          event_name: event.event_name,
          event_date: event.event_date
        }));
  
        console.log('Processed Events:', this.allEvents);
      },
      error: (error) => {
        console.error('DETAILED Events Fetch Error:', error);
        console.error('Error Details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
        this.snackBar.open('Failed to load events', 'Close', { duration: 3000 });
      }
    });
  }  

  fetchAttendance() {
    this.apiService.getAttendance().subscribe(
      (response: any) => {
        if (response && response.code === 200) {
          this.dataSource.data = Array.isArray(response.data)
            ? response.data.map((item: any) => {
                console.log('Attendance Record:', item); // Debugging: log each attendance record
  
                // Validate that the image string is not empty and in the correct format
                const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;
                if (item.image && base64Pattern.test(item.image)) {
                  return {
                    ...item,
                    image: this.sanitizer.bypassSecurityTrustUrl(item.image), // No need to prepend 'data:image/jpeg;base64,' again
                    // Ensure attendance ID is correctly passed along with each record
                    attendanceId: item.id // Add a field for attendance ID
                  };
                } else {
                  console.warn('Invalid Image Data:', item.image);
                  return { ...item, image: '', attendanceId: item.id }; // Add attendanceId if image is invalid
                }
              })
            : [];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          console.error('Failed to fetch Attendance.', response ? response.errmsg : 'Unknown error');
        }
      },
      (error) => {
        console.error('Error fetching Attendance', error);
      }
    );
  }
  
  

  fetchApprovedParticipants() {
    this.apiService.getApprovedParticipants().subscribe({
      next: (response: any) => {
        console.log('Raw Approved Participants Response:', response);
  
        if (!response || (response.code !== 200 && !response.data)) {
          console.warn('NO APPROVED PARTICIPANTS: Empty or invalid response');
          this.snackBar.open('No approved participants found', 'Close', { duration: 3000 });
          return;
        }
  
        this.approvedDataSource.data = response.data || [];
        this.updateUniqueEvents();
      },
      error: (error) => {
        console.error('DETAILED Approved Participants Error:', error);
        console.error('Error Details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
        this.snackBar.open('Failed to load approved participants', 'Close', { duration: 3000 });
      }
    });
  }

  updateUniqueEvents() {
    // Combine events from different sources (pending, approved, all)
    const allEventsData = [
      ...this.dataSource.data.map(item => ({
        event_name: item.event_name,
        event_date: item.event_date
      })),
      ...this.approvedDataSource.data.map(item => ({
        event_name: item.event_name,
        event_date: item.event_date
      })),
      ...this.allEvents
    ];
  
    // Using a Set to ensure uniqueness
    const uniqueEventSet = new Set<string>();
    const combinedEvents: EventInfo[] = [];
  
    allEventsData.forEach(event => {
      const eventKey = `${event.event_name}|${event.event_date}`;
      
      // Only add the event if it's unique
      if (!uniqueEventSet.has(eventKey)) {
        uniqueEventSet.add(eventKey);
        combinedEvents.push(event);
      }
    });
  
    // Set the final unique events list
    this.uniqueEvents = combinedEvents;
  }
  

  approvedAttendance(data: any) {
    this.apiService.approvedAttendance(data).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        
        if (response && (response.status === 'success' || response.code === 200)) {
          this.snackBar.open('Attendance approved successfully', 'Close', {
            duration: 3000
          });
  
          this.fetchAttendance();
          this.fetchApprovedParticipants();
        } else {
          this.snackBar.open(response.message || 'Failed to approve attendance', 'Close', {
            duration: 3000
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error approving attendance:', error);
        
        let errorMessage = 'Error occurred while approving attendance';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000
        });
      }
    });
  }

getPendingAttendanceForEvent(eventName: string) {
  return this.dataSource.data.filter(item => item.event_name === eventName);
}

getApprovedAttendanceForEvent(eventName: string) {
  return this.approvedDataSource.data.filter(item => item.event_name === eventName);
}

deleteUserAttendance(attendanceId: string) {
  const confirmation = window.confirm(`Are you sure you want to delete attendance with ID: ${attendanceId}?`);
  if (confirmation) {
    console.log('Deleting attendance with ID:', attendanceId); // Debug attendance ID
    this.apiService.deleteUserAttendance({ id: attendanceId }).subscribe(
      (response: any) => {
        if (response && response.status && response.status.remarks === 'success') {
          this.snackBar.open('User attendance record deleted successfully', 'Close', {
            duration: 3000
          });
          this.fetchAttendance(); // Refresh attendance list
        } else {
          console.error('Failed to delete user attendance record:', response.status.message);
          this.snackBar.open('Failed to delete user attendance record.', 'Close', {
            duration: 3000
          });
        }
      },
      (error) => {
        console.error('Error deleting user attendance record:', error);
        this.snackBar.open('Error deleting user attendance record.', 'Close', {
          duration: 3000
        });
      }
    );
  }
}




  isEventWithoutAttendance(eventName: string): boolean {
    return this.getPendingAttendanceForEvent(eventName).length === 0 &&
           this.getApprovedAttendanceForEvent(eventName).length === 0;
  }

}
