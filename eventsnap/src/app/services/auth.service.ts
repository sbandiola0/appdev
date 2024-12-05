import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  // Admin login (keeping your previous admin code unchanged)
  login(id: string, password: string) {
    return this.http.post<any>('http://localhost/appdev/eventsnap/backend_php/api/login', { id, password })
      .pipe(
        map(response => {
          if (response.success) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);
            return response;
          } else {
            throw new Error(response.error);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of({ success: false, error: error.message || 'Login failed' });
        })
      );
  }

  // User login (new code)
  userLogin(student_id: string, password: string) {
    return this.http.post<any>('http://localhost/appdev/eventsnap/backend_php/api/userLogin', { student_id, password })
      .pipe(
        map(response => {
          // console.log('User login response:', response); 

          if (response.success) {
            // Save user data in localStorage
            localStorage.setItem('userToken', response.token);
            localStorage.setItem('userId', response.data.student_id); // Access userId from data
            localStorage.setItem('userLastName', response.data.last_name); // Store full last name
            localStorage.setItem('userFirstName', response.data.first_name); // Store full first name
            localStorage.setItem('userCourse', response.data.program); // Access user course
            this.router.navigate(['/events']); // Redirect to events if login is successful
            return response;
          } else {
            throw new Error(response.error || 'Login failed');
          }
        }),
        catchError(error => {
          console.error('User login error:', error);
          return of({ success: false, error: error.message || 'Login failed' });
        })
      );
}

  
  

  // Check if user is authenticated
  isUserAuthenticated(): boolean {
    const token = localStorage.getItem('userToken');
    return token !== null && token !== undefined;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
  }

  // Method to get logged-in user data
  getLoggedInUserData() {
    return {
      id: localStorage.getItem('userId'),
      name: localStorage.getItem('userFirstName')  + ' ' + localStorage.getItem('userLastName'),
      userId: localStorage.getItem('userId'),
      course: localStorage.getItem('userCourse')
    };
  }

  // Admin logout
  logout() {
    localStorage.clear();
    localStorage.removeItem('token');
    this.router.navigate(['/admin-login']);
  }

  // User logout
  // userLogout() {
  //   localStorage.removeItem('userToken');
  //   localStorage.removeItem('userId');
  //   localStorage.removeItem('userLastName');
  //   localStorage.removeItem('userFirstName'); 
  //   localStorage.removeItem('userCourse'); 
  //   this.router.navigate(['/home']); 
  // }

  userLogout() {
    localStorage.clear(); // Clears all items from local storage
    this.router.navigate(['/home']); // Redirect to home after logout
  }
  
}
