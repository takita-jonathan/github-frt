import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RepoListItemComponent} from './repo-list-item.component';
import {IGithubRepo} from '../../../interfaces/github-repo.interface';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';

describe('RepoListItemComponent', () => {
  let component: RepoListItemComponent;
  let fixture: ComponentFixture<RepoListItemComponent>;

  const mockRepo: IGithubRepo = {
    name: 'test-repo',
    description: 'Test description',
    language: 'JavaScript',
    fork: true,
    html_url: 'https://github.com/test/test-repo',
    stargazers_count: 42
  } as IGithubRepo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RepoListItemComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        CommonModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RepoListItemComponent);
    component = fixture.componentInstance;
    component.repo = mockRepo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the repo name', () => {
    const nameElement = fixture.debugElement.query(By.css('.repo-card__title')).nativeElement;
    expect(nameElement.textContent).toBe('test-repo');
  });

  it('should render the repo description', () => {
    const descriptionElement = fixture.debugElement.query(By.css('.repo-card__description')).nativeElement;
    expect(descriptionElement.textContent.trim()).toBe('Test description');
  });

  it('should render the repo language', () => {
    const languageElement = fixture.debugElement.query(By.css('.repo-card__subtitle')).nativeElement;
    expect(languageElement.textContent).toContain('Main Language: JavaScript');
  });

  it('should not show "Forked" if repo.fork is false', () => {
    component.repo.fork = false;
    fixture.detectChanges();
    const forkedStatus = fixture.debugElement.query(By.css('.repo-card__forked-status'));
    expect(forkedStatus).toBeFalsy();
  });

  it('should render the number of stars', () => {
    const starsElement = fixture.debugElement.query(By.css('.repo-card__stars')).nativeElement;
    expect(starsElement.textContent).toContain('42');
  });

  it('should call window.open when openRepo is called', () => {
    spyOn(window, 'open'); // Espionando a função window.open
    component.openRepo(mockRepo.html_url);
    expect(window.open).toHaveBeenCalledWith(mockRepo.html_url, '_blank');
  });
});
