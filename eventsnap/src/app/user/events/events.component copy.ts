// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../../services/api.service';
// import { Router } from '@angular/router';
// import { EventService } from '../../services/event.service';
// import { CommonModule } from '@angular/common';
// import { UserComponent } from '../user/user.component';

// @Component({
//   selector: 'app-events',
//   standalone: true,
//   imports: [CommonModule, UserComponent],
//   templateUrl: './events.component.html',
//   styleUrls: ['./events.component.css']
// })
// export class EventsComponent implements OnInit {
//   events: any[] = [];
//   attendedEvents: any[] = [];
//   currentDate: Date = new Date();
//   eventParticipantsCount: any = {}; 

//   constructor(
//     private eventsService: ApiService,
//     private router: Router,
//     private eventService: EventService
//   ) {}

//   ngOnInit(): void {
//     this.fetchEvents();
//     this.getAttendedEvents(); 
//     this.updateTime();
//     setInterval(() => {
//       this.updateTime();
//     }, 1000);
//     this.getApprovedParticipantsCount();
//   }

//   fetchEvents() {
//     this.eventsService.getEvents().subscribe(
//       (response: any) => {
//         if (response && response.code === 200) {
//           this.events = response.data;
//         } else {
//           console.error('Failed to fetch Events.', response ? response.errmsg : 'Unknown error');
//         }
//       },
//       (error) => {
//         console.error('Error fetching events', error);
//       }
//     );
//   }


//   getAttendedEvents() {
//     const userId = localStorage.getItem('userId');
//     if (userId) {
//       this.eventsService.getEventHistory(userId).subscribe({
//         next: (data) => {
//           this.attendedEvents = data;
//         },
//         error: (error) => {
//           console.error('Error fetching attended events:', error);
//         }
//       });
//     }
//   }

//   hasAttendedEvent(eventId: string): boolean {
//     return this.attendedEvents.some((attendedEvent) => attendedEvent.event_id === eventId);
//   }

//   isPastEvent(eventDate: string, eventEndTime: string): boolean {
//     const eventEndDateTime = new Date(`${eventDate}T${eventEndTime}`).getTime();
//     return eventEndDateTime < this.currentDate.getTime();
//   }

//   attendEvent(event: any) {
//     console.log("Attending event:", event);
//     localStorage.setItem('selectedEvent', JSON.stringify(event)); 
//     this.router.navigate(['/image-capture']);
//   }

//   updateTime() {
//     this.currentDate = new Date();
//   }

//   formatEventDateTime(eventDate: string, eventTime: string): string {
//     const date = new Date(`${eventDate}T${eventTime}`);
//     return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
//   }



//   getApprovedParticipantsCount() {
//     this.eventsService.getApprovedParticipantsCount().subscribe(
//       (response) => {
//         console.log('API Response for Approved Participants Count:', response);
//         if (response.status === 'success') {
         
//           response.data.forEach((event: any) => {
//             this.eventParticipantsCount[event.event_name] = event.approved_count;
//           });
//         } else {
//           console.error('Failed to fetch count:', response.message);
//         }
//       },
//       (error) => {
//         console.error('Error fetching count:', error);
//       }
//     );
//   }

//   getApprovedCount(event: any): number {
//     return this.eventParticipantsCount[event.event_name] || 0; 
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, UserComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  attendedEvents: any[] = [];
  currentDate: Date = new Date();
  eventParticipantsCount: any = {}; 
  attendedEventsMap: { [eventId: string]: string } = {};

  constructor(
    private eventsService: ApiService,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.getAttendedEvents(); 
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
    this.getApprovedParticipantsCount();
  }

  fetchEvents() {
    this.eventsService.getEvents().subscribe(
      (response: any) => {
        if (response && response.code === 200) {
          this.events = response.data;
        } else {
          console.error('Failed to fetch Events.', response ? response.errmsg : 'Unknown error');
        }
      },
      (error) => {
        console.error('Error fetching events', error);
      }
    );
  }

  getAttendedEvents() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.eventsService.getEventHistory(userId).subscribe({
        next: (data) => {
          this.attendedEvents = data;
        },
        error: (error) => {
          console.error('Error fetching attended events:', error);
        }
      });
    }
  }


  hasAttendedEvent(eventId: string): any {
    return this.attendedEvents.find(
      (attendedEvent) => attendedEvent.event_id === eventId
    );
  }
  

  // hasAttendedEvent(eventId: string): boolean {
  //   return this.attendedEvents.some((attendedEvent) => attendedEvent.event_id === eventId);
  // }

  isPastEvent(eventDate: string, eventEndTime: string): boolean {
    const eventEndDateTime = new Date(`${eventDate}T${eventEndTime}`).getTime();
    return eventEndDateTime < this.currentDate.getTime();
  }


  attendEvent(event: any) {
    console.log("Attending event:", event);
    localStorage.setItem('selectedEvent', JSON.stringify(event)); 
    this.router.navigate(['/image-capture']);
  }
  

  updateTime() {
    this.currentDate = new Date();
  }

  formatEventDateTime(eventDate: string, eventTime: string): string {
    const date = new Date(`${eventDate}T${eventTime}`);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  getApprovedParticipantsCount() {
    this.eventsService.getApprovedParticipantsCount().subscribe(
      (response) => {
        console.log('API Response for Approved Participants Count:', response);
        if (response.status === 'success') {
          response.data.forEach((event: any) => {
            this.eventParticipantsCount[event.event_name] = event.approved_count;
          });
        } else {
          console.error('Failed to fetch count:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching count:', error);
      }
    );
  }

  getApprovedCount(event: any): number {
    return this.eventParticipantsCount[event.event_name] || 0;
  }

  
}
