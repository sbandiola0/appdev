import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // Add authorization header with either admin or user JWT token if available
    const adminToken = localStorage.getItem('token');
    const userToken = localStorage.getItem('userToken');
    
    let token = adminToken ? adminToken : userToken;  // Use adminToken if present, otherwise userToken

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}