import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IUser} from '../../interfaces/user.interface';
import {UserService} from '../../services/user.service';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'ghf-user-profile',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  user: IUser | null = null;

  constructor(private userService: UserService) {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

}
