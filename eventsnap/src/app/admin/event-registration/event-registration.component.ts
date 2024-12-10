import { ApiService } from './../../services/api.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule, MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface EventInfo {
  event_name: string;
  event_date: string;
  id: string;
}

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, MatTabsModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatPaginator,
    MatIconModule,
    MatIconAnchor,
    MatIconButton,
    MatTableModule,
  ],
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css']
})
export class EventRegistrationComponent implements OnInit {
  displayedColumns: string[] = ['student_id', 'last_name', 'first_name', 'status', 'actions'];
  attendanceDataSource = new MatTableDataSource<any>();
  attendanceDisplayedColumns: string[] = ['student_id', 'last_name', 'first_name', 'image', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: { eventId: number } // Injected eventId
  ) {}

  ngOnInit(): void {
    this.fetchRegistrants();
    this.getAttendance();
  }

// Modify your `getAttendance` method to handle the presence of the image property
getAttendance() {
  const eventId = this.data.eventId;

  this.apiService.getAttendanceById(eventId).subscribe(
    (response: any) => {
      if (response && response.status?.remarks === 'success') {
        const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;

        // Process the attendance records
        const attendanceData = Array.isArray(response.data)
          ? response.data.map((item: any) => {
              // Check if the image exists and is a valid base64 format
              if (item.image) {
                // Only prepend 'data:image/png;base64,' or 'data:image/jpeg;base64,' if not already present
                const imageBase64 = item.image;
                if (!imageBase64.startsWith('data:image/png;base64,') && !imageBase64.startsWith('data:image/jpeg;base64,')) {
                  if (imageBase64.startsWith('iVBORw0KGgo')) {
                    item.image = `data:image/png;base64,${imageBase64}`;
                  } else if (imageBase64.startsWith('/9j/')) {
                    item.image = `data:image/jpeg;base64,${imageBase64}`;
                  }
                }
                return {
                  ...item,
                  image: this.sanitizer.bypassSecurityTrustUrl(item.image), // No need to prepend 'data:image/jpeg;base64,' again
                  attendanceId: item.id, // Include attendance ID
                };
              } else {
                console.warn('Invalid Image Data:', item.image);
                return { ...item, image: '', attendanceId: item.id }; // Handle invalid image
              }
            })
          : [];

        console.log('Processed Attendance Data:', attendanceData);

        // Assign to dataSource
        this.attendanceDataSource.data = attendanceData;

        // Attach paginator and sorter
        this.attendanceDataSource.paginator = this.paginator;
        this.attendanceDataSource.sort = this.sort;
      } else {
        console.error('Failed to fetch attendance data:', response?.status?.message || 'Unknown error');
        this.snackBar.open('Failed to fetch attendance data.', 'Close', { duration: 3000 });
      }
    },
    (error: HttpErrorResponse) => {
      console.error('Error fetching attendance:', error);
      this.snackBar.open('Failed to fetch attendance data.', 'Close', { duration: 3000 });
    }
  );
}









  fetchRegistrants() {
    const eventId = this.data.eventId; // Use the injected eventId
    this.apiService.getRegistrants(eventId).subscribe(
      (response: any) => {
        // Directly access the array from the response
        const registrantsData = response.map((item: any) => ({
          ...item,
          image: this.sanitizer.bypassSecurityTrustUrl(item.image),
        }));
  
        // Filter data based on the eventId
        this.dataSource.data = registrantsData.filter((registrant: any) =>
          Number(registrant.event_id) === Number(eventId) // Ensure type safety
        );
  
        // Attach paginator and sorter
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        console.log('Filtered Registrants:', this.dataSource.data);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching registrants:', error);
        this.snackBar.open('Failed to fetch registrants.', 'Close', { duration: 3000 });
      }
    );
  }   

  updateStatus(studentId: number, eventId: number, status: string) {
    const data = {
      student_id: studentId,
      event_id: eventId,
      status: status,
    };
  
    this.apiService.updateRegistrantStatus(data).subscribe(
      (response: any) => {
        // Check if the response has a 'status' object and if 'remarks' is 'success'
        if (response && response.status && response.status.remarks === "success") {
          this.snackBar.open(`Status updated to ${status}`, 'Close', { duration: 3000 });
          this.fetchRegistrants(); // Refresh the data after updating
        } else {
          this.snackBar.open(response.status.message || 'Failed to update status.', 'Close', { duration: 3000 });
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating status:', error);
        this.snackBar.open('Failed to update status.', 'Close', { duration: 3000 });
      }
    );
  }  
}