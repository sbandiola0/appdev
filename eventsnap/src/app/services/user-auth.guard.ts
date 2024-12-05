import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const isAuthenticated = this.authService.isUserAuthenticated(); // Check if the user is authenticated
  
      // If user is authenticated and trying to access home, redirect to events
      if (isAuthenticated) {
        if (state.url === '/home') {
          this.router.navigate(['/events']); // Redirect to events
          return false; // Prevent navigation to home
        }
        return true; // Allow access to user routes
      } else {
        // If user is not authenticated and trying to access routes other than home, redirect to home
        if (state.url !== '/home') {
          this.router.navigate(['/home']); // Redirect to login/home
          return false;
        }
      }
  
      return true; // If none of the conditions match
    }
}
