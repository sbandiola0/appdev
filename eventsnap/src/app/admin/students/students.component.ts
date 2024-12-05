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
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    AdminComponent,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormField,
    MatFormFieldModule,
    EditUserModalComponent,
    MatIconButton,
    MatIconModule,
    HttpClientModule,
    RouterLink,
    RouterModule, FormsModule
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
 
   dataSource = new MatTableDataSource<any>(); // Data source for the table
    displayedColumns: string[] = ['student_id', 'last_name', 'first_name', 'middle_name','program', 'email','password','actions']; // Displayed columns
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(private apiService: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}
  
    ngOnInit(): void {
      this.fetchStudents(); // Fetch initial student data
    }
  
    fetchStudents(): void {
      this.apiService.getUsers().subscribe(
        (response: any) => {
          if (response && response.code === 200) {
            this.dataSource.data = Array.isArray(response.data) ? response.data : [];
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this.snackBar.open('Failed to fetch students.', 'Close', { duration: 3000 });
          }
        },
        (error) => {
          this.snackBar.open('Error fetching students.', 'Close', { duration: 3000 });
        }
      );
    }
  
    openEditDialog(user: any): void {
      const dialogRef = this.dialog.open(EditUserModalComponent, {
        width: '500px',
        data: user // Pass student data
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.apiService.updateUser(result).subscribe(
            (response: any) => {
              if (response && response.code === 200) {
                this.fetchStudents(); // Refresh the student list after update
              } else {
                this.snackBar.open('Failed to update student.', 'Close', { duration: 3000 });
              }
            },
            (error) => {
              this.snackBar.open('Error updating student.', 'Close', { duration: 3000 });
            }
          );
        }
      });
    }
  
    deleteUser(user: any): void {
      if (confirm(`Are you sure you want to delete ${user.last_name}?`)) {
        // Change `id` to `student_id`
        this.apiService.deleteUser({ student_id: user.student_id }).subscribe(
          (response: any) => {
            if (response.code === 200) {
              this.fetchStudents();
              this.snackBar.open('Student deleted successfully.', 'Close', { duration: 3000 });
            } else {
            }
          },
          (error) => {
            this.snackBar.open('Error deleting student.', 'Close', { duration: 3000 });
          }
        );
      }
    }
    
  }
  