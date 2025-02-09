import {TestBed} from '@angular/core/testing';

import {HttpErrorInterceptor} from './http-error.interceptor';
import {HttpErrorResponse, HttpHandler, HttpRequest} from '@angular/common/http';
import {NotificationService} from '../shared/notification/notification.service';
import {throwError} from 'rxjs';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let nextSpy: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showNotification']);
    nextSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptor,
        { provide: NotificationService, useValue: notificationServiceSpy },
      ]
    });

    interceptor = TestBed.inject(HttpErrorInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  function testErrorHandling(status: number, expectedMessage: string) {
    const request = new HttpRequest('GET', '/test');
    const errorResponse = new HttpErrorResponse({ status, statusText: 'Error' });
    nextSpy.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(request, nextSpy).subscribe({
      error: () => {
        expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith(expectedMessage, 'error');
      }
    });
  }

  it('should display notification for error 400', () => {
    testErrorHandling(400, 'Requisição inválida');
  });

  it('should display notification for error 401', () => {
    testErrorHandling(401, 'Não autorizado');
  });

  it('should display notification for error 500', () => {
    testErrorHandling(500, 'Erro interno no servidor');
  });

  it('should display default message for unexpected error', () => {
    testErrorHandling(418, 'Erro inesperado, tente novamente mais tarde');
  });

});
