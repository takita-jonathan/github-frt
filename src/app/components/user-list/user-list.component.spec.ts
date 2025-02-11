import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserListComponent} from './user-list.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CommonModule} from '@angular/common';
import {GithubService} from '../../services/http/github.service';
import {UserService} from '../../services/user.service';
import {of} from 'rxjs';
import {IGithubUser} from '../../interfaces/github-user.interface';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {By} from '@angular/platform-browser';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let githubServiceMock: jasmine.SpyObj<GithubService>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  const mockUsers = [
    { login: 'octocat', avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4' } as any as IGithubUser,
    { login: 'octodude', avatar_url: 'https://avatars.githubusercontent.com/u/583232?v=4' } as any as IGithubUser
  ];

  const mockSearchResponse = {
    total_count: 2,
    items: mockUsers,
    incomplete_results: false
  };

  const activatedRouteMock = {
    snapshot: { paramMap: {} } // Mock para o ActivatedRoute
  };

  beforeEach(async () => {
    githubServiceMock = jasmine.createSpyObj('GithubService', ['searchUsers']);
    userServiceMock = jasmine.createSpyObj('UserService', ['setSearchQuery'], {
      search$: of('octocat')
    });

    githubServiceMock.searchUsers.and.returnValue(of(mockSearchResponse));

    await TestBed.configureTestingModule({
      imports: [
        UserListComponent, MatPaginatorModule, CommonModule, RouterModule
      ],
      providers: [
        { provide: GithubService, useValue: githubServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideAnimationsAsync()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the list of users when users are found', () => {
    component.users$.subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].login).toBe('octocat');
    });

    githubServiceMock.searchUsers('octocat', 1, 10);
    fixture.detectChanges();

    const userItems = fixture.debugElement.queryAll(By.css('ghf-user-list-item'));
    expect(userItems.length).toBe(2);
  });

  it('should display "Nenhum usuário encontrado" when no users are found', async () => {
    const mockEmptyResponse = { total_count: 0, items: [], incomplete_results: false };
    githubServiceMock.searchUsers.and.returnValue(of(mockEmptyResponse));
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 };

    component.onPageChange(pageEvent);

    component.users$.subscribe(users => {
      expect(users.length).toBe(0);
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const messageElement = fixture.debugElement.nativeElement.querySelector('.user-list__message');
    expect(messageElement).not.toBeNull();
    expect(messageElement.textContent).toBe('Nenhum usuário encontrado.');
  });


  it('should update paginator page when page changes', () => {
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 };

    component.onPageChange(pageEvent);

    expect(component['pageSubject'].value.page).toBe(2);
  });

  it('should call githubService.searchUsers with correct query, page and pageSize', () => {
    const mockResponse = { total_count: 2, items: mockUsers, incomplete_results: false };
    githubServiceMock.searchUsers.and.returnValue(of(mockResponse));

    userServiceMock.setSearchQuery('octocat');
    component['pageSubject'].next({ page: 1, pageSize: 10 });

    fixture.detectChanges();

    expect(githubServiceMock.searchUsers).toHaveBeenCalledWith('octocat', 1, 10);
  });

});
