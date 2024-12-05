import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { EventsComponent } from './events/events.component';
import { AuthGuard } from '../services/auth.guard';
import { HomeComponent } from '../home/home.component';
import { UserAuthGuard } from '../services/user-auth.guard';
import { HistoryComponent } from './history/history.component';
import { EventRegistrationComponent } from './event-registration/event-registration.component';

const routes: Routes = [

      { path: 'user', component: UserComponent, canActivate: [UserAuthGuard]},
      { path: 'events', component: EventsComponent, canActivate: [UserAuthGuard]},
      { path: 'home', component: HomeComponent},
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      { path: 'history', component: HistoryComponent, canActivate: [UserAuthGuard]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
