import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';



@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css'
})

export class EditUserModalComponent {
 
  user: any; // Declare a variable to hold student data
  isModalOpen = true;

  constructor(
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = { ...data }; // Copy the passed student data
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the modal
  }

  onSaveClick(): void {
    this.dialogRef.close(this.user); // Return updated student data when the modal is closed
  }

  closeModal() {
    this.isModalOpen = false; // Close modal programmatically
  }
}

