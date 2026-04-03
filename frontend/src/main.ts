import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { LOCALE_ID } from '@angular/core';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'en-US' }
  ]
}).catch(err => console.error(err));