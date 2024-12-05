import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdminstudentComponent } from '../adminstudent/adminstudent.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from '../user/user/user.component';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AboutComponent } from '../user/about/about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AdminstudentComponent, HttpClientModule, UserComponent, AboutComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isModalOpen = false;
  currentDate: Date = new Date();
  loginData = {
    student_id: '',
    password: ''
  };
  registerData = {
    last_name: '', 
    first_name: '',
    middle_name: '',
    email: '',
    student_id: '', 
    program: '',
    password: ''  
  };
  

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {}

  login() {
    this.authService.userLogin(this.loginData.student_id, this.loginData.password).subscribe(
      (response: any) => {
        if (response.success) {
          // console.log('Login successful');
          this.authService.isUserAuthenticated();  // Check if user is authenticated
        } else {
          alert('Invalid login credentials');
        }
      },
      (error) => {
        console.error('Login failed', error);
        alert('Login failed: ' + error.error);
      }
    );
  }

  register() {
    this.apiService.userRegister(this.registerData).subscribe(
        (response: any) => {
            console.log(response);
            alert('Registration successful');
            this.closeModal(); // Close the modal after registration
        },
        (error) => {
            console.error('Registration failed', error);
            alert('Registration failed: ' + error.error);
        }
    );
}





ngOnInit(): void {
  this.updateTime();
  setInterval(() => {
    this.updateTime();
  }, 1000);
}
updateTime() {
  this.currentDate = new Date();
}

formatEventDateTime(eventDate: string, eventTime: string): string {
  const date = new Date(`${eventDate}T${eventTime}`);
  return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}
}