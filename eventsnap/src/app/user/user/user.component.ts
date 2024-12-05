  import { CommonModule } from '@angular/common';
  import { Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
  import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
  import { AdminstudentComponent } from '../../adminstudent/adminstudent.component';
  import { HomeComponent } from '../../home/home.component';
  import { ApiService } from '../../services/api.service';
  import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';


  @Component({
    selector: 'app-user',
    standalone: true,
    imports: [CommonModule, RouterLink, AdminstudentComponent, HomeComponent, RouterModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.css'
  })


  export class UserComponent implements OnInit {
    currentDate: Date = new Date();
    isSidebarOpen = false;
    loggedInUser: { name: string | null, course: string | null } = { name: null, course: null };

    constructor(
      private apiService: ApiService,
      private router: Router,
      private eventService: EventService,
      private authService: AuthService
    ) {}

    ngOnInit(): void {
      this.updateTime();
      setInterval(() => {
        this.updateTime();
      }, 1000);
  
      // Retrieve logged-in user data
      const userData = this.authService.getLoggedInUserData();
      this.loggedInUser.name = userData.name;
      this.loggedInUser.course = userData.course;
    }

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }

    isPastEvent(eventDate: string, eventEndTime: string): boolean {
      const eventEndDateTime = new Date(`${eventDate}T${eventEndTime}`).getTime();
      return eventEndDateTime < this.currentDate.getTime();
    }
  
    attendEvent(event: any) {
      this.eventService.setEvent(event);
      this.router.navigate(['/image-capture'], { state: { event } });
    }

    updateTime() {
      this.currentDate = new Date();
    }
  
    formatEventDateTime(eventDate: string, eventTime: string): string {
      const date = new Date(`${eventDate}T${eventTime}`);
      return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
    
    logout() {
      this.authService.userLogout(); // Call the logout method from AuthService
      this.router.navigate(['/home']); // Navigate to the desired route after logout
    }
  }


