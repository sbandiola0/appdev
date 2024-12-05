// event.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private selectedEvent: any = null;

  setEvent(event: any) {
    this.selectedEvent = event;
  }

  getEvent(): any {
    return this.selectedEvent;
  }

  clearEvent() {
    this.selectedEvent = null;
  }
}
