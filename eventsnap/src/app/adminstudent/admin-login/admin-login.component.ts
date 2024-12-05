import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminstudentComponent } from '../adminstudent.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminstudentComponent, RouterLink, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  id: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    if (!this.id || !this.password) {
      this.error = 'ID and password are required';
    } else {
      this.authService.login(this.id, this.password)
        .subscribe(
          (response) => {
            if (response.success) {
              this.router.navigate(['/dashboard']);
            } else {
              this.error = response.error;
            }
          },
          (error: HttpErrorResponse) => {
            this.error = error.error.error || 'An error occurred during login';
          }
        );
    }
  }

  goToHome() {
    this.router.navigate(['/adminstudent']);
  }
}
