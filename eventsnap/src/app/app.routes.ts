import { RouterModule, Routes } from '@angular/router';
import { AdminstudentComponent } from './adminstudent/adminstudent.component';
import {HomeComponent} from './home/home.component';
// import { AdminComponent } from './admin/admin/admin.component';
import { AdminLoginComponent } from './adminstudent/admin-login/admin-login.component';
import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';
import { StudentsComponent } from './admin/students/students.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AttendanceSuccessComponent } from './user/attendance-success/attendance-success.component';
import { EventComponent } from './admin/event/event.component';
import { UsersAttendedEventsComponent } from './admin/users-attended-events/users-attended-events.component';
import { ImageCaptureComponent } from './user/image-capture/image-capture.component';
import { EventsComponent } from './user/events/events.component';
import { UserComponent } from './user/user/user.component';
import { UserAuthGuard } from './services/user-auth.guard';
import { EditUserModalComponent } from './admin/students/edit-user-modal/edit-user-modal.component';
import { HistoryComponent } from './user/history/history.component';
import { AboutComponent } from './user/about/about.component';
import { EventRegistrationComponent } from './admin/event-registration/event-registration.component';
import { SubmissionDetailsComponent } from './user/submission-details/submission-details.component';


export const routes: Routes = [
  { path: 'adminstudent', component: AdminstudentComponent  },
  { path: 'home', component: HomeComponent},
  { path: '', component: HomeComponent},
  { path: 'user', component: UserComponent, canActivate: [UserAuthGuard]},
  { path: 'admin-login', component: AdminLoginComponent, canActivate: [AuthGuard]},
  { path: 'admin', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'students', component: StudentsComponent,},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'attendance-success', component: AttendanceSuccessComponent, canActivate: [UserAuthGuard]},
  { path: 'event', component: EventComponent, canActivate: [AuthGuard] },
  { path: 'users-attended-events', component: UsersAttendedEventsComponent},
  { path: 'image-capture', component: ImageCaptureComponent, canActivate: [UserAuthGuard] },
  { path: 'about', component: AboutComponent},
  { path: 'events', component: EventsComponent, canActivate: [UserAuthGuard]},
  { path: 'edit-user-modal', component: EditUserModalComponent, canActivate: [AuthGuard]},
  { path: 'history', component: HistoryComponent, canActivate: [UserAuthGuard]},
  { path: 'event-registration', component: EventRegistrationComponent },
  { path: 'submission-details/:id', component: SubmissionDetailsComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true}), FormsModule],
  exports: [RouterModule],
})

export class AppRoutes{}
