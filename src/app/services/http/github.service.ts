import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {IUser} from '../../interfaces/user.interface';
import {LoadingService} from '../../shared/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly API_URL = 'https://api.github.com';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getUser(username: string): Observable<IUser> {
    this.loadingService.show();
    return this.http.get<IUser>(`${this.API_URL}/users/${username}`).pipe(
      finalize(() => this.loadingService.hide()),
    );
  }

}
