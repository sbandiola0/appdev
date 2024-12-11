import { ApiService } from './../../services/api.service';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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
  styleUrls: ['./event-registration.component.css'],
})
export class EventRegistrationComponent implements OnInit {
  displayedColumns: string[] = ['student_id', 'last_name', 'first_name', 'status', 'actions'];
  attendanceDisplayedColumns: string[] = ['student_id', 'last_name', 'first_name', 'image', 'status', 'actions'];
  attendanceDataSource = new MatTableDataSource<any>([]);
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  totalRegistrants: number = 0;
  approvedRegistrants: number = 0;
  rejectedRegistrants: number = 0;
  totalAttendees: number = 0;
  approvedAttendees: number = 0;
  rejectedAttendees: number = 0;
  chart!: Chart;


  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: { eventId: number }, // Injected eventId
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchRegistrants();
    this.fetchAttendees();
    this.getAttendance();
    this.createChart();
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

createChart(): void {
  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new Chart(this.chartCanvas.nativeElement, {
    type: 'pie',
    data: {
      labels: ['Total Registrants', 'Approved Registrants', 'Rejected Registrants', 'Total Attendees', 'Approved Attendees', 'Rejected Attendees'],
      datasets: [{
        label: 'Registrants/Attendees',
        data: [
          this.totalRegistrants,
          this.approvedRegistrants,
          this.rejectedRegistrants,
          this.totalAttendees,
          this.approvedAttendees,
          this.rejectedAttendees
        ],
        backgroundColor: ['#4e73df', '#1cc88a', '#e74a3b', '#36b9cc', '#f6c23e', '#e74a3b'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#d03f25', '#2c9faf', '#d4b20d', '#d03f25'],
        borderColor: ['#4e73df', '#1cc88a', '#e74a3b', '#36b9cc', '#f6c23e', '#e74a3b'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'left',  // Aligns the legend to the left
          labels: {
            padding: 20,  // Adds padding to the left of the labels
            boxWidth: 20,  // Adjusts the size of the color box next to the label
          }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;  // Shows the value of the segment
            }
          }
        }
      }
    }
  });
}



fetchRegistrants() {
  const eventId = this.data.eventId; // Use the injected eventId
  this.apiService.getRegistrants(eventId).subscribe(
    (response: any) => {
      const registrantsData = response.map((item: any) => ({
        ...item,
        image: this.sanitizer.bypassSecurityTrustUrl(item.image),
      }));
  
      this.dataSource.data = registrantsData.filter((registrant: any) =>
        Number(registrant.event_id) === Number(eventId)
      );
      
      // Calculate registrant statistics
      this.totalRegistrants = this.dataSource.data.length;
      this.approvedRegistrants = this.dataSource.data.filter(registrant => registrant.status === 'Approved').length;
      this.rejectedRegistrants = this.dataSource.data.filter(registrant => registrant.status === 'Rejected').length;

      // Create chart once data is fetched and values are populated
      this.createChart();

      // Attach paginator and sorter
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    (error: HttpErrorResponse) => {
      console.error('Error fetching registrants:', error);
      this.snackBar.open('Failed to fetch registrants.', 'Close', { duration: 3000 });
    }
  );
}
 

fetchAttendees() {
  const eventId = this.data.eventId;
  this.apiService.getAttendees(eventId).subscribe(
    (response: any) => {
      const attendeesData = response.map((item: any) => ({
        ...item,
        image: this.sanitizer.bypassSecurityTrustUrl(item.image),
      }));
  
      this.attendanceDataSource.data = attendeesData.filter((attendee: any) =>
        Number(attendee.event_id) === Number(eventId)
      );
      
      // Calculate attendee statistics
      this.totalAttendees = this.attendanceDataSource.data.length;
      this.approvedAttendees = this.attendanceDataSource.data.filter(attendee => attendee.status === 'Approved').length;
      this.rejectedAttendees = this.attendanceDataSource.data.filter(attendee => attendee.status === 'Rejected').length;

      // Create chart once data is fetched and values are populated
      this.createChart();

      // Attach paginator and sorter
      this.attendanceDataSource.paginator = this.paginator;
      this.attendanceDataSource.sort = this.sort;
    },
    (error: HttpErrorResponse) => {
      console.error('Error fetching attendees:', error);
      this.snackBar.open('Failed to fetch attendees.', 'Close', { duration: 3000 });
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
        if (response && response.status && response.status.remarks === "success") {
          this.snackBar.open(`Status updated to ${status}`, 'Close', { duration: 3000 });
          this.fetchRegistrants(); // Refresh the data
          this.cdr.detectChanges(); // Manually trigger change detection
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
  
  updateAttendanceStatus(studentId: number, eventId: number, status: string) {
    const data = {
      student_id: studentId,
      event_id: eventId,
      status: status,
    };
  
    this.apiService.updateAttendanceStatus(data).subscribe(
      (response: any) => {
        if (response && response.status && response.status.remarks === "success") {
          this.snackBar.open(`Status updated to ${status}`, 'Close', { duration: 3000 });
          this.fetchAttendees(); // Refresh the data
          this.cdr.detectChanges(); // Manually trigger change detection
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