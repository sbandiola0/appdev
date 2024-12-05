import { Component, OnInit } from '@angular/core';
import { MatRow, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [MatPaginator, MatIconModule, MatIconAnchor, UserComponent,MatIconButton, MatTableModule, RouterModule, RouterLink, MatSortModule, MatPaginatorModule, MatButtonModule, CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['student_id', 'last_name', 'program', 'event_name', 'event_date', 'timestamp', 'image'];
  approvedAttendanceDisplayedColumns: string[] = ['student_id', 'last_name', 'program', 'event_name', 'event_date', 'timestamp', 'image'];

  dataSource = new MatTableDataSource<any>();
  approvedAttendanceDataSource = new MatTableDataSource<any>();


  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId'); // Assuming you're storing userId in localStorage during login
    if (userId) {
      this.getUserEventHistory(userId);
      this.getUserApprovedAttendance(userId);
    }
  }

  getUserEventHistory(userId: string): void {
    this.apiService.getEventHistory(userId).subscribe({
      next: (data) => {
        console.log('Event History Data:', data); // Log the data received
        this.dataSource.data = data; // Populate the data source with the fetched data
      },
      error: (error) => {
        console.error('Error fetching event history:', error);
      }
    });
  }
  
  getUserApprovedAttendance(userId: string): void {
    // Fetch approved attendance records for the user
    this.apiService.getUserApprovedAttendance(userId).subscribe({
      next: (data) => {
        console.log('Approved Attendance Data:', data);
        this.approvedAttendanceDataSource.data = data;
      },
      error: (error) => {
        console.error('Error fetching approved attendance data:', error);
      }
    });
  }
}