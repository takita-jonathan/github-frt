import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IGithubUser} from '../../interfaces/github-user.interface';
import {catchError, Observable, of} from 'rxjs';
import {GithubService} from '../../services/http/github.service';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'ghf-user-profile',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  user$: Observable<IGithubUser | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private githubService: GithubService
  ) {
    const username = this.route.snapshot.paramMap.get('username') || '';
    this.user$ = this.githubService.getUser(username)
      .pipe(
        catchError(() => {
          this.router.navigate(['/']).then();
          return of(null);
        })
      );
  }

}
