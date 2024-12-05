import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminstudentComponent } from '../adminstudent/adminstudent.component';
import { StudentsComponent } from './students/students.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditUserModalComponent } from './students/edit-user-modal/edit-user-modal.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminstudentComponent, 
    StudentsComponent,
    DashboardComponent,
    EditUserModalComponent, 
    CanvasJSAngularChartsModule,
  ]
})
export class AdminModule { }
