import { TestBed } from '@angular/core/testing';

import { GithubService } from './github.service';
import {HttpClientTestingModule, HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  const API_URL = 'https://api.github.com';


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GithubService,
        provideHttpClient(),
        provideHttpClientTesting()
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
});
