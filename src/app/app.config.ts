import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {HttpErrorInterceptor} from './interceptors/http-error.interceptor';
import {ConfigService} from './services/config.service';

export function initializeApp() {
  return async () => {
    console.log('Initializing Configs...');
    await inject(ConfigService).loadConfig();
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    provideAppInitializer(initializeApp()),
  ]
};
