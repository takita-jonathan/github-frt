import {Injectable} from '@angular/core';
import {GithubService} from './http/github.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {IUser} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usernameSubject = new BehaviorSubject<string>('octocat');
  private userSubject = new Subject<IUser>();

  public username$ = this.usernameSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor(
    private githubService: GithubService,
  ) {
    this.usernameSubject.subscribe({
      next: username => {
        this.searchUser(username);
      }
    });
  }

  private searchUser(username: string) {
    if (!username.trim()) return;

    this.githubService.getUser(username).subscribe({
      next: user => this.userSubject.next(user)
    });
  }

  setUsername(username: string) {
    if (username.trim() && username !== this.usernameSubject.value) {
      this.usernameSubject.next(username);
    }
  }

}
