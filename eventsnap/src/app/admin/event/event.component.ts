import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { EditEventDialogComponent } from './edit-event-dialog/edit-event-dialog.component';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { EventRegistrationComponent } from '../event-registration/event-registration.component';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [AdminComponent, MatTableModule, MatIconModule, RouterLink, RouterModule, MatPaginatorModule, MatIconModule, MatIconButton, EditEventDialogComponent, MatSortModule, MatButtonModule, MatPaginator, MatSort],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})

export class EventComponent implements OnInit {
  dataSource = new MatTableDataSource<any>(); // Data source for the table
  displayedColumns: string[] = ['event_name', 'school_name', 'event_date', 'event_start_time', 'event_end_time', 'max_participants', 'actions']; 

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginator reference
  @ViewChild(MatSort) sort!: MatSort; // Sort reference

  constructor(private apiService: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.fetchEvents(); // Fetch initial event data
  }

  fetchEvents(): void {
    this.apiService.getEvents().subscribe(
      (events: any[]) => {
        console.log('Fetched Events:', events);
        
        if (events.length > 0) {
          this.dataSource.data = events;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          console.warn('No events found');
          this.snackBar.open('No events available', 'Close', { duration: 3000 });
        }
      },
      (error) => {
        console.error('Events Fetch Error:', error);
        this.snackBar.open('Failed to fetch events', 'Close', { duration: 3000 });
      }
    );
  }

  openEditDialog(event: any): void {
    const dialogRef = this.dialog.open(EditEventDialogComponent, {
      width: '500px',
      data: event // Pass the event data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Updating event with data:', result); // Log the data
        this.apiService.updateEvent(result).subscribe(
          (response: any) => {
            if (response && response.status && response.status.remarks === 'failed') {
              console.error('Failed to update event.', response.status.message);
            } else {
              // Handle success
            }
          },
          (error) => {
            console.error('Error updating event', error);
          }
        );
      }
    });
  }

  openAddEventDialog(): void {
    const dialogRef = this.dialog.open(AddEventModalComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.addEvent(result).subscribe(
          (response: any) => {
            if (response && response.status && response.status.remarks === 'failed') {
              console.error('Failed to update user.', response.status.message);
              this.router.navigate(['/event']);
            } else {
              // Handle success
            }
          },
          (error) => {
            console.error('Error updating user', error);
          }
        );
      }
    });
  }

  openRegistrantsComponent(): void {
    const dialogRef = this.dialog.open(EventRegistrationComponent, {
      width: '1000px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.addEvent(result).subscribe(
          (response: any) => {
            if (response && response.status && response.status.remarks === 'failed') {
              console.error('Failed to update user.', response.status.message);
              this.router.navigate(['/event-registration']);
            } else {
              // Handle success
            }
          },
          (error) => {
            console.error('Error updating user', error);
          }
        );
      }
    });
  }

  deleteEvent(event: any): void {
    if (confirm(`Are you sure you want to delete the event: ${event.event_name}?`)) {
      this.apiService.deleteEvent({ id: event.id }).subscribe(
        (response: any) => {
          if (response.status.remarks === 'failed') {
            console.error('Failed to delete event.', response.status.message);
            this.snackBar.open('Failed to delete event.', 'Close', { duration: 3000 });
          } else {
            this.fetchEvents();
            this.snackBar.open('Event deleted successfully.', 'Close', { duration: 3000 });
          }
        },
        (error) => {
          console.error('Error deleting event', error);
          this.snackBar.open('Error deleting event.', 'Close', { duration: 3000 });
        }
      );
    }
  }
}