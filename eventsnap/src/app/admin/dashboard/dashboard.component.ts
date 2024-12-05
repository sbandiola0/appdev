import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditUserModalComponent } from '../students/edit-user-modal/edit-user-modal.component';
import { HttpClient } from '@angular/common/http';
import { CanvasJS, CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AdminComponent, CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormField, MatFormFieldModule, EditUserModalComponent, MatIconButton, MatIconModule,
    CanvasJSAngularChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  bsitCount = 0;
  bscsCount = 0;
  bsemcCount = 0;
  userAttendedCount = 0;
  chartOptionsUsers: any = {};
  chartOptionsPrograms: any = {};
  dataSource = new MatTableDataSource<any>(); // Data source for the table
  displayedColumns: string[] = ['student_id', 'last_name', 'first_name', 'middle_name', 'program', 'email', 'date_added'];
  chartOptionsEvents: any = {};
  approvedParticipantsCount: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchStudentCounts();
    this.fetchUsers();
    this.fetchEventParticipants(); // Fetch and prepare data for bar chart
    this.getApprovedParticipantsCount();
  }

  // Fetch Users data and populate the table
  fetchUsers(): void {
    this.apiService.getUsers().subscribe(
      (response: any) => {
        if (response && response.code === 200) {
          this.dataSource.data = response.data;
        } else {
          console.error('Failed to fetch Users.', response ? response.errmsg : 'Unknown error');
        }
      },
      (error) => {
        console.error('Error fetching Users', error);
      }
    );
  }

  // Fetch student counts based on their program
  fetchStudentCounts(): void {
    this.apiService.getUsers().subscribe((response: any) => {
      if (response && response.data) {
        const users = response.data;
        this.bsitCount = users.filter((user: any) => user.program === 'BSIT').length;
        this.bscsCount = users.filter((user: any) => user.program === 'BSCS').length;
        this.bsemcCount = users.filter((user: any) => user.program === 'BSEMC').length;
        this.setChartOptionsPrograms();
      } else {
        console.error('Failed to fetch student counts.', response ? response.errmsg : 'Unknown error');
      }
    });
  }

  // Set options for the doughnut chart representing program distributions
  setChartOptionsPrograms(): void {
    this.chartOptionsPrograms = {
      animationEnabled: true,
      backgroundColor: 'transparent',
      color: 'white',
      title: {
        fontColor: 'white',
      },
      data: [{
        type: 'doughnut',
        startAngle: 240,
        yValueFormatString: '##0',
        indexLabel: '{label} {y}',
        dataPoints: [
          { y: this.bsitCount, label: 'BSIT', color: '#F6D55C' },
          { y: this.bscsCount, label: 'BSCS', color: '#3CAEA3' },
          { y: this.bsemcCount, label: 'BSEMC', color: '#ED553B' }
        ]
      }]
    };
  }

  // Fetch event participants and prepare data for the bar chart
  fetchEventParticipants(): void {
    this.apiService.getApprovedParticipantsCount().subscribe((response: any) => {
      console.log('Event Participants Response:', response); // Debugging response
      if (response && response.data) {
        const dataPoints = response.data.map((event: any) => {
          console.log(`Event: ${event.event_name}, Approved Attendance: ${event.approved_count}`); // Log approvedAttendance for debugging
          return {
            label: event.event_name || 'Unnamed Event', // Use the event name as label
            y: event.approved_count || 0,                // Use approved_count from the response
            color: '#3CAEA3',                            // Customize color
          };
        });
        this.setChartOptionsEvents(dataPoints);
      } else {
        console.error('Failed to fetch event participants.', response ? response.errmsg : 'Unknown error');
      }
    });
  }
  

  // Fetch the approved attendance for an event
  getApprovedAttendance(event: any): number {
    if (!event || !event.participants) return 0;

    const approvedCount = event.participants.filter(
      (participant: any) => participant.status === 'approved'
    ).length;

    return approvedCount;
  }

  // Get count of approved participants from the API
  getApprovedParticipantsCount(): void {
    this.apiService.getApprovedParticipantsCount().subscribe(
      (response) => {
        console.log('API Response for Approved Participants Count:', response); // Add this for debugging
        if (response.status === 'success') {
          this.approvedParticipantsCount = response.approved_count;
        } else {
          console.error('Failed to fetch count:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching count:', error);
      }
    );
  }
  

  // Set chart options for events' approved participants
  setChartOptionsEvents(dataPoints: any[]): void {
    this.chartOptionsEvents = {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Participants per Event",
        fontSize: 20,
      },
      axisX: {
        title: "Events",
        labelFontSize: 14,
        labelAngle: -45, // Rotate labels if event names are long
      },
      axisY: {
        title: "Participants Count",
        labelFontSize: 14,
      },
      data: [
        {
          type: "column",
          dataPoints: dataPoints, // Approved participants data points
        }
      ]
    };
  }
  
}
