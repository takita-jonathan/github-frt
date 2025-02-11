import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {finalize, from, Observable, of, switchMap, tap} from 'rxjs';
import {IGithubUser} from '../../interfaces/github-user.interface';
import {LoadingService} from '../../shared/loading/loading.service';
import {IGithubSearchRes} from '../../interfaces/github-search-res.interface';
import {IGithubRepo} from '../../interfaces/github-repo.interface';
import {CacheService} from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly API_URL = 'https://api.github.com';

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private cacheService: CacheService
  ) { }

  getUser(username: string): Observable<IGithubUser> {
    this.loadingService.show();
    const cacheKey = `user_${username}`;

    return this.cacheService.getData<IGithubUser>(cacheKey)
      .pipe(
        switchMap(cachedUser => {
          if (cachedUser) {
            return of(cachedUser);
          } else {
            return this.http.get<IGithubUser>(
              `${this.API_URL}/users/${username}`,
            ).pipe(
              tap(user => this.cacheService.storeData(cacheKey, user))
            )
          }
        }),
        finalize(() => {this.loadingService.hide();})
      )
  }

  searchUsers(query: string = '', page: number = 1, perPage: number = 10): Observable<IGithubSearchRes<IGithubUser>> {
    this.loadingService.show();
    const searchQuery = query.trim() ? query : 'repos:>0';
    const cacheKey = `search_${searchQuery}_${page}_${perPage}`;

    return this.cacheService.getData<IGithubSearchRes<IGithubUser>>(cacheKey)
      .pipe(
        switchMap(cachedSearchRes => {
          if (cachedSearchRes) {
            return of(cachedSearchRes);
          } else {
            return this.http.get<IGithubSearchRes<IGithubUser>>(
              `${this.API_URL}/search/users?q=${searchQuery}&page=${page}&per_page=${perPage}`,
            ).pipe(
              tap(searchRes => this.cacheService.storeData(cacheKey, searchRes))
            )
          }
        }),
        finalize(() => {this.loadingService.hide();})
      )
  }

  getUserRepositories(username: string, page: number = 1, perPage: number = 10, sort: 'stars' | 'name' = 'name', direction: 'asc' | 'desc' = 'asc'): Observable<IGithubSearchRes<IGithubRepo>> {
    this.loadingService.show();
    const cacheKey = `repos_${username}_${page}_${perPage}_${sort}_${direction}`;

    return this.cacheService.getData<IGithubSearchRes<IGithubRepo>>(cacheKey)
      .pipe(
        switchMap(cachedSearchRes => {
          if (cachedSearchRes) {
            return of(cachedSearchRes);
          } else {
            return this.http.get<IGithubSearchRes<IGithubRepo>>(
              `${this.API_URL}/search/repositories?q=user:${username}+fork:true&sort=${sort}&order=${direction}&page=${page}&per_page=${perPage}`,
            ).pipe(
              tap(searchRes => this.cacheService.storeData(cacheKey, searchRes))
            )
          }
        }),
        finalize(() => {this.loadingService.hide();})
      )
  }

}
