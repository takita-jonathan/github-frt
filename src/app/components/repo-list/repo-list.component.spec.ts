import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RepoListComponent} from './repo-list.component';
import {GithubService} from '../../services/http/github.service';
import {IGithubRepo} from '../../interfaces/github-repo.interface';
import {BehaviorSubject, of} from 'rxjs';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {By} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

describe('RepoListComponent', () => {
  let component: RepoListComponent;
  let fixture: ComponentFixture<RepoListComponent>;
  let githubServiceMock: jasmine.SpyObj<GithubService>;
  let activatedRouteMock: { paramMap: BehaviorSubject<any> };

  const mockRepos: IGithubRepo[] = [
    { name: 'Repo 1', html_url: 'https://github.com/repo1', language: 'JavaScript', stargazers_count: 50, fork: false, description: 'Description 1' } as unknown as IGithubRepo,
    { name: 'Repo 2', html_url: 'https://github.com/repo2', language: 'TypeScript', stargazers_count: 100, fork: true, description: 'Description 2' } as unknown as IGithubRepo
  ];

  const mockResponse = {
    total_count: 2,
    items: mockRepos,
    incomplete_results: false
  };

  beforeEach(async () => {
    githubServiceMock = jasmine.createSpyObj('GithubService', ['getUserRepositories']);
    githubServiceMock.getUserRepositories.and.returnValue(of(mockResponse));

    const paramMapSubject = new BehaviorSubject({ get: (key: string) => 'octocat' });
    activatedRouteMock = {
      paramMap: paramMapSubject
    };

    await TestBed.configureTestingModule({
      imports: [
        RepoListComponent,
        MatPaginatorModule,
        MatButtonToggleModule,
        MatChipsModule,
        CommonModule,
      ],
      providers: [
        { provide: GithubService, useValue: githubServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideAnimationsAsync()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RepoListComponent);
    component = fixture.componentInstance;

    component['pageSubject'].next({ page: 1, pageSize: 10 });

    activatedRouteMock.paramMap.next({ get: () => 'octocat' });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of repositories', async () => {
    fixture.detectChanges();

    const repoListElements = fixture.debugElement.queryAll(By.css('ghf-repo-list-item'));
    expect(repoListElements.length).toBe(mockRepos.length);
  });

  it('should display "No repositories" message if there are no repositories', () => {
    githubServiceMock.getUserRepositories.and.returnValue(of({ total_count: 0, items: [], incomplete_results: false }));
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 };
    component.onPageChange(pageEvent);

    fixture.detectChanges();
    const noReposMessage = fixture.debugElement.query(By.css('.user-repositories__message')).nativeElement;
    expect(noReposMessage.textContent).toContain('Este usuário não possui repositórios públicos.');
  });

  it('should call getUserRepositories with correct parameters on sorting change', () => {
    component.sort = 'name';
    component.order = 'asc';
    component.onSortingChange();

    expect(githubServiceMock.getUserRepositories).toHaveBeenCalledWith('octocat', 1, 10, 'name', 'asc');
  });

  it('should call getUserRepositories with correct parameters on pagination change', () => {
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 };
    component.onPageChange(pageEvent);

    expect(githubServiceMock.getUserRepositories).toHaveBeenCalledWith('octocat', 2, 10, 'stars', 'desc');
  });
});
