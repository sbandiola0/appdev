import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AdminstudentComponent } from '../../adminstudent/adminstudent.component';
import { RouterLink, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminstudentComponent, RouterModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  currentDate: Date = new Date();
  isSidebarOpen: boolean = false; // Add this to track sidebar state

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Initial time setup
    this.updateTime();

    // Update the time every second
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  // Method to handle sidebar toggle
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Method to handle logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin-login']); // Ensure the user is redirected to the login page after logout
  }

  // Method to keep the current time updated
  updateTime(): void {
    this.currentDate = new Date();
  }

  // Navigation method for home
  // goToHome(): void {
  //   this.router.navigate(['/admin-login']);
  // }
}
