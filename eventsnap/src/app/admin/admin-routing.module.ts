import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { StudentsComponent } from './students/students.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditUserModalComponent } from './students/edit-user-modal/edit-user-modal.component';

const routes: Routes = [
  {path: 'admin', component: DashboardComponent},
  {path: 'student', component: StudentsComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'edit-user-modal', component: EditUserModalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
