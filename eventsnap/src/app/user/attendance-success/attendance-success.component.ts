import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventsComponent } from '../events/events.component';


@Component({
  selector: 'app-attendance-success',
  standalone: true,
  imports: [EventsComponent, RouterLink],
  templateUrl: './attendance-success.component.html',
  styleUrl: './attendance-success.component.css'
})
export class AttendanceSuccessComponent {

}
