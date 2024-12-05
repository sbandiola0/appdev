import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-edit-event-dialog',
  standalone: true,
  imports: [MatButtonModule, MatPaginator, MatPaginatorModule, MatFormFieldModule, MatFormField, FormsModule, CommonModule],
  templateUrl: './edit-event-dialog.component.html',
  styleUrl: './edit-event-dialog.component.css'
})


export class EditEventDialogComponent {

  event: any; // Declare a variable to hold the event data
  isModalOpen = true;
  constructor(
    public dialogRef: MatDialogRef<EditEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.event = { ...data };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.event);
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
