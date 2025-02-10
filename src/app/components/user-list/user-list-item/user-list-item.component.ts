import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'ghf-user-list-item',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './user-list-item.component.html',
  styleUrl: './user-list-item.component.scss'
})
export class UserListItemComponent {

  @Input({required: true}) login!: string;
  @Input({required: true}) avatar_url!: string;


  constructor(private router: Router) {
  }

  goToProfile() {
    if (this.login) {
      this.router.navigate([this.login]).then();
    }
  }
}
