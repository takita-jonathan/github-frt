import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {IGithubUser} from '../../interfaces/github-user.interface';
import {LoadingService} from '../../shared/loading/loading.service';
import {IGithubUserSearchRes} from '../../interfaces/github-user-search-res.interface';
import {IGithubRepo} from '../../interfaces/github-repo.interface';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly API_URL = 'https://api.github.com';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getUser(username: string): Observable<IGithubUser> {
    this.loadingService.show();
    return this.http.get<IGithubUser>(
      `${this.API_URL}/users/${username}`,
    ).pipe(
      finalize(() => this.loadingService.hide()),
    );
  }

  searchUsers(query: string = '', page: number = 1, perPage: number = 10): Observable<IGithubUserSearchRes> {
    const searchQuery = query.trim() ? query : 'repos:>0';

    this.loadingService.show();
    return this.http.get<IGithubUserSearchRes>(
      `${this.API_URL}/search/users?q=${searchQuery}&page=${page}&per_page=${perPage}`,
    ).pipe(
      finalize(() => this.loadingService.hide()),
    );
  }

  getUserRepositories(username: string, perPage: number = 10, sortBy: 'stars' | 'name' = 'stars', direction: 'desc' | 'asc' = 'asc'): Observable<IGithubRepo[]> {
    this.loadingService.show();
    return this.http.get<IGithubRepo[]>(
      `${this.API_URL}/users/${username}/repos?per_page=${perPage}&sort=${sortBy}&direction=${direction}`,
    ).pipe(
      finalize(() => this.loadingService.hide())
    );
  }



}
