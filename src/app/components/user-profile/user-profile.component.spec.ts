import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import {GithubService} from '../../services/http/github.service';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {IGithubUser} from '../../interfaces/github-user.interface';
import {RouterTestingModule} from '@angular/router/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {of, throwError} from 'rxjs';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {By} from '@angular/platform-browser';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let githubServiceMock: jasmine.SpyObj<GithubService>;
  let activatedRouteMock: { snapshot: { paramMap: any } };
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: IGithubUser = {
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    name: 'The Octocat',
    bio: 'An octocat bio',
    followers: 100,
    following: 50,
    location: 'GitHub Universe'
  } as unknown as IGithubUser;

  beforeEach(async () => {
    githubServiceMock = jasmine.createSpyObj('GithubService', ['getUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRouteMock = {
      snapshot: {
        paramMap: { get: () => 'octocat' }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        UserProfileComponent,
        MatCardModule,
        MatIconModule,
      ],
      providers: [
        { provide: GithubService, useValue: githubServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerSpy },
        provideAnimationsAsync()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create',async () => {
    githubServiceMock.getUser.and.returnValue(of(mockUser));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display user details when user is found', () => {
    githubServiceMock.getUser.and.returnValue(of(mockUser));

    fixture.detectChanges();
    const name = fixture.debugElement.query(By.css('.user-profile__name')).nativeElement;
    expect(name.textContent).toBe('The Octocat');

    const bio = fixture.debugElement.query(By.css('.user-profile__bio')).nativeElement;
    expect(bio.textContent).toBe('An octocat bio');

    const followers = fixture.debugElement.query(By.css('.user-profile__stat')).nativeElement;
    expect(followers.textContent).toContain('100 seguidores');
  });

  it('should navigate to home page when user is not found', async () => {
    githubServiceMock.getUser.and.returnValue(throwError(() => new Error('User not found')));

    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display "Localização não informada" if location is not available', () => {
    const userWithoutLocation: IGithubUser = { ...mockUser, location: '' };
    githubServiceMock.getUser.and.returnValue(of(userWithoutLocation));

    fixture.detectChanges();

    const location = fixture.debugElement.query(By.css('.user-profile__stat--location')).nativeElement;
    expect(location.textContent).toContain('Localização não informada');
  });
});
