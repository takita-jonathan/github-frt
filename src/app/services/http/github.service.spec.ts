import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {GithubService} from './github.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {LoadingService} from '../../shared/loading/loading.service';
import {CacheService} from '../cache/cache.service';
import {of} from 'rxjs';
import {ConfigService} from '../config.service';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let cacheServiceMock: jasmine.SpyObj<CacheService>;
  let configServiceMock: jasmine.SpyObj<ConfigService>;

  const API_URL = 'https://api.github.com';
  const GITHUB_TOKEN = 'fake-token';

  beforeEach(() => {
    loadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    cacheServiceMock = jasmine.createSpyObj('CacheService', ['getData', 'storeData']);
    configServiceMock = jasmine.createSpyObj('ConfigService', ['getConfig']);
    configServiceMock.getConfig.and.returnValue({ API_URL, GITHUB_TOKEN });


    TestBed.configureTestingModule({
      providers: [
        GithubService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingService },
        { provide: CacheService, useValue: cacheServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ]
    });

    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a user from GitHub and store it in cache', fakeAsync(() => {
    const mockUser = { login: 'octocat', name: 'The Octocat' };

    cacheServiceMock.getData.and.returnValue(of(null));
    cacheServiceMock.storeData.and.returnValue(of({ ok: true }));

    service.getUser('octocat').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.login).toBe('octocat');
      expect(user.name).toBe('The Octocat');
    });

    const req = httpMock.expectOne(`${API_URL}/users/octocat`);
    req.flush(mockUser);

    tick();
    expect(cacheServiceMock.storeData).toHaveBeenCalledWith('user_octocat', mockUser);
  }));

  it('should return cached user if available', fakeAsync(() => {
    const mockUser = { login: 'octocat', name: 'The Octocat' };

    cacheServiceMock.getData.and.returnValue(of(mockUser));

    service.getUser('octocat').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.login).toBe('octocat');
      expect(user.name).toBe('The Octocat');
    });

    tick();
    expect(cacheServiceMock.getData).toHaveBeenCalledWith('user_octocat');
  }));

  it('should handle error when getUser fails', fakeAsync(() => {
    const errorMessage = 'User not found';

    cacheServiceMock.getData.and.returnValue(of(null));

    service.getUser('nonexistentUser').subscribe({
      next: () => { },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne(`${API_URL}/users/nonexistentUser`);
    req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });

    tick();
  }));

  it('should fetch repositories for a user with correct sort and direction', fakeAsync(() => {
    const mockRepos = {
      total_count: 2,
      items: [
        { name: 'repo1', description: 'Description 1', stargazers_count: 10 },
        { name: 'repo2', description: 'Description 2', stargazers_count: 5 }
      ]
    };

    cacheServiceMock.getData.and.returnValue(of(null));
    cacheServiceMock.storeData.and.returnValue(of({ ok: true }));

    service.getUserRepositories('octocat', 1, 10, 'stars', 'desc').subscribe(repos => {
      expect(repos).toBeTruthy();
      expect(repos.items.length).toBe(2);
      expect(repos.items[0].name).toBe('repo1');
    });

    const req = httpMock.expectOne(`${API_URL}/search/repositories?q=user:octocat+fork:true&sort=stars&order=desc&page=1&per_page=10`);
    req.flush(mockRepos);

    tick();
  }));

  it('should handle error when getUserRepositories fails', fakeAsync(() => {
    const errorMessage = 'Repositories not found';

    cacheServiceMock.getData.and.returnValue(of(null));

    service.getUserRepositories('nonexistentUser', 1, 10, 'stars', 'desc').subscribe({
      next: () => { },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne(`${API_URL}/search/repositories?q=user:nonexistentUser+fork:true&sort=stars&order=desc&page=1&per_page=10`);
    req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });

    tick();
  }));

  it('should call loadingService.show() when getUser is called', fakeAsync(() => {
    const mockUser = { login: 'octocat', name: 'The Octocat' };

    cacheServiceMock.getData.and.returnValue(of(null));

    service.getUser('octocat').subscribe();

    expect(loadingService.show).toHaveBeenCalled();
    const req = httpMock.expectOne(`${API_URL}/users/octocat`);
    req.flush(mockUser);

    tick();
  }));

  it('should call loadingService.hide() after getUser is called', fakeAsync(() => {
    const mockUser = { login: 'octocat', name: 'The Octocat' };

    cacheServiceMock.getData.and.returnValue(of(null));

    service.getUser('octocat').subscribe();
    const req = httpMock.expectOne(`${API_URL}/users/octocat`);
    req.flush(mockUser);

    tick();
    expect(loadingService.hide).toHaveBeenCalled();
  }));
});
