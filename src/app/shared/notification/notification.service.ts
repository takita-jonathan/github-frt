import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotificationComponent} from './notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {
  }

  showNotification(message: string, type: 'success' | 'error' | 'warning' = 'error', duration: number = 3000) {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration,
      data: { message, type },
      panelClass: [`notification--${type}`],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

}
