import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { HomeComponent } from '../home/home.component';
import { HistoryComponent } from './history/history.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    EventsComponent,
    UserRoutingModule,
    UserComponent, 
    HomeComponent, 
    HistoryComponent,
  
  ]
})
export class UserModule { }
