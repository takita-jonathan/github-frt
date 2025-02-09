import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {NotificationService} from '../shared/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) { }

  private errorMessages: Record<number, string> = {
    400: 'Requisição inválida',
    401: 'Não autorizado',
    403: 'Acesso negado',
    404: 'Recurso não encontrado',
    500: 'Erro interno no servidor'
  };

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.errorMessages[error.status] || 'Erro inesperado, tente novamente mais tarde';
        this.notificationService.showNotification(errorMessage, 'error');
        return throwError(() => new Error(error.message));
      })
    );
  }
}
