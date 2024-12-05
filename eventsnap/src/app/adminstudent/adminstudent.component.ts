import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { UserComponent } from '../user/user/user.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-adminstudent',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule, HomeComponent, UserComponent, HttpClientModule, FormsModule,],
  templateUrl: './adminstudent.component.html',
  styleUrl: './adminstudent.component.css'
})
export class AdminstudentComponent {
  constructor(private authService: AuthService) { }


  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
 


