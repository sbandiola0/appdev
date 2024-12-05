  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
  import { AdminstudentComponent } from './adminstudent/adminstudent.component';
  import { UserComponent } from './user/user/user.component';
  import { HttpClientModule } from '@angular/common/http';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EditUserModalComponent } from './admin/students/edit-user-modal/edit-user-modal.component';
import { StudentsComponent } from './admin/students/students.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { UsersAttendedEventsComponent } from './admin/users-attended-events/users-attended-events.component';
import { EventsComponent } from './user/events/events.component';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './user/history/history.component';

  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, AdminstudentComponent, UserComponent, HttpClientModule, RouterModule, FormsModule, 
      DashboardComponent, MatPaginator, MatTableModule, MatPaginatorModule, MatSortModule, MatIconButton, MatIconModule, EditUserModalComponent, 
      ReactiveFormsModule, MatInputModule, StudentsComponent, CanvasJSAngularChartsModule, UsersAttendedEventsComponent, EventsComponent,
      HomeComponent,HistoryComponent
  ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
  })

  export class AppComponent {

  }