import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {IGithubUser} from '../../interfaces/github-user.interface';
import {catchError, Observable, of} from 'rxjs';
import {GithubService} from '../../services/http/github.service';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'ghf-user-profile',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    RouterModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  user$: Observable<IGithubUser | null> = new Observable<IGithubUser | null>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private githubService: GithubService
  ) { }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username') || '';
    this.user$ = this.githubService.getUser(username)
      .pipe(
        catchError((err) => {
          console.log('Caught error:', err);
          this.router.navigate(['/']).then();
          return of(null);
        })
      );
  }

}
