import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Admin authentication logic
    if (this.authService.isAuthenticated()) {
      // If the user is admin and trying to access admin login, redirect to dashboard
      if (state.url === '/admin-login') {
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true; // Allow access to admin routes
    } else if (state.url !== '/admin-login') {
      this.router.navigate(['/admin-login']);
      return false; // Redirect to admin login
    }

    return true; // If none of the conditions match
  }
}
