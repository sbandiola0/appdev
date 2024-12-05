import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { AdminLoginComponent } from './adminstudent/admin-login/admin-login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient(), ApiService,AdminLoginComponent, provideAnimationsAsync()
  ]
};
