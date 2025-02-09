import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'ghf-header',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  username: string = '';

  constructor(
    private userService: UserService,
  ) {}

  searchUser() {
    if (!this.username.trim()) return;
    this.userService.setUsername(this.username);
  }

}
