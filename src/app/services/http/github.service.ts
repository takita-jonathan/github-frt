import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {IGithubUser} from '../../interfaces/github-user.interface';
import {LoadingService} from '../../shared/loading/loading.service';
import {IGithubSearchRes} from '../../interfaces/github-search-res.interface';
import {IGithubRepo} from '../../interfaces/github-repo.interface';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly API_URL = 'https://api.github.com';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getUser(username: string): Observable<IGithubUser> {
    console.log(username);
    this.loadingService.show();
    return this.http.get<IGithubUser>(
      `${this.API_URL}/users/${username}`,
    ).pipe(
      finalize(() => this.loadingService.hide()),
    );
  }

  searchUsers(query: string = '', page: number = 1, perPage: number = 10): Observable<IGithubSearchRes<IGithubUser>> {
    const searchQuery = query.trim() ? query : 'repos:>0';

    this.loadingService.show();
    return this.http.get<IGithubSearchRes<IGithubUser>>(
      `${this.API_URL}/search/users?q=${searchQuery}&page=${page}&per_page=${perPage}`,
    ).pipe(
      finalize(() => this.loadingService.hide()),
    );
  }

  getUserRepositories(username: string, page: number = 1, perPage: number = 10, sort: 'stars' | 'name' = 'name', direction: 'asc' | 'desc' = 'asc'): Observable<IGithubSearchRes<IGithubRepo>> {
    this.loadingService.show();
    return this.http.get<IGithubSearchRes<IGithubRepo>>(
      `${this.API_URL}/search/repositories?q=user:${username}+fork:true&sort=${sort}&order=${direction}&page=${page}&per_page=${perPage}`,
    ).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

}
