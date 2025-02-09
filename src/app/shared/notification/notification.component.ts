import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'ghf-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class NotificationComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string, type: string },
    private snackBarRef: MatSnackBarRef<NotificationComponent>
  ) {}

  closeNotification() {
    this.snackBarRef.dismiss();
  }

}
