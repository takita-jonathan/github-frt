import {TestBed} from '@angular/core/testing';

import {GithubService} from './github.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {LoadingService} from '../../shared/loading/loading.service';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;


  const API_URL = 'https://api.github.com';


  beforeEach(() => {
    loadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);


    TestBed.configureTestingModule({
      providers: [
        GithubService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingService }
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

  it('should fetch a user from GitHub', () => {
    const mockUser = {
      login: 'octocat',
      name: 'The Octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4'
    };

    service.getUser('octocat').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.login).toBe('octocat');
      expect(user.name).toBe('The Octocat');
    });

    const req = httpMock.expectOne(`${API_URL}/users/octocat`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should fetch repositories for a user with correct sort and direction', () => {
    const mockRepos = {
      total_count: 2,
      items: [
        { name: 'repo1', description: 'Description 1', stargazers_count: 10 },
        { name: 'repo2', description: 'Description 2', stargazers_count: 5 }
      ]
    };

    service.getUserRepositories('octocat', 1, 10, 'stars', 'desc').subscribe(repos => {
      expect(repos).toBeTruthy();
      expect(repos.items[0].name).toBe('repo1');
    });

    const req = httpMock.expectOne(`${API_URL}/search/repositories?q=user:octocat+fork:true&sort=stars&order=desc&page=1&per_page=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should call loadingService.show() when getUser is called', () => {
    const mockUser = { login: 'octocat', name: 'The Octocat' };

    service.getUser('octocat').subscribe();

    expect(loadingService.show).toHaveBeenCalled();
    const req = httpMock.expectOne(`${API_URL}/users/octocat`);
    req.flush(mockUser);
  });

  it('should call loadingService.hide() after getUser is called', () => {
    const mockUser = { login: 'octocat', name: 'The Octocat' };

    service.getUser('octocat').subscribe();
    const req = httpMock.expectOne(`${API_URL}/users/octocat`);
    req.flush(mockUser);

    expect(loadingService.hide).toHaveBeenCalled();
  })

  it('should handle error when getUser fails', () => {
    const errorMessage = 'User not found';

    service.getUser('nonexistentUser').subscribe({
      next: () => { },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne(`${API_URL}/users/nonexistentUser`);
    req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });
  });

  it('should call searchUsers with default query when no query is provided', () => {
    const mockSearchResponse = { total_count: 1, items: [{ login: 'octocat' }] };

    service.searchUsers().subscribe(response => {
      expect(response.items.length).toBe(1);
      expect(response.items[0].login).toBe('octocat');
    });

    const req = httpMock.expectOne(`${API_URL}/search/users?q=repos:>0&page=1&per_page=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSearchResponse);
  });

  it('should call searchUsers with correct query when search term is provided', () => {
    const mockSearchResponse = { total_count: 1, items: [{ login: 'octocat' }] };

    service.searchUsers('octocat').subscribe(response => {
      expect(response.items.length).toBe(1);
      expect(response.items[0].login).toBe('octocat');
    });

    const req = httpMock.expectOne(`${API_URL}/search/users?q=octocat&page=1&per_page=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSearchResponse);
  });

});
