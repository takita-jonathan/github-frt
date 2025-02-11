import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserListItemComponent} from './user-list-item.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';

describe('UserListItemComponent', () => {
  let component: UserListItemComponent;
  let fixture: ComponentFixture<UserListItemComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'mocked-username'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        UserListItemComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        CommonModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the login correctly', () => {
    component.login = 'octocat';
    fixture.detectChanges();
    const loginElement = fixture.debugElement.query(By.css('.user-card__title')).nativeElement;
    expect(loginElement.textContent).toBe('octocat');
  });

  it('should display the avatar image correctly', () => {
    component.avatar_url = 'https://avatars.githubusercontent.com/u/583231?v=4';
    fixture.detectChanges();
    const avatarImage = fixture.debugElement.query(By.css('.user-card__avatar')).nativeElement;
    expect(avatarImage.src).toBe('https://avatars.githubusercontent.com/u/583231?v=4');
  });

  it('should render the correct GitHub link', () => {
    component.login = 'octocat';
    fixture.detectChanges();
    const githubLink = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(githubLink.href).toBe('https://github.com/octocat');
  });

  it('should have the correct routerLink', () => {
    component.login = 'octocat';
    fixture.detectChanges();
    const cardElement = fixture.debugElement.query(By.css('.user-card')).nativeElement;
    expect(cardElement.getAttribute('ng-reflect-router-link')).toBe('octocat');
  });

  it('should render the user card with the correct class', () => {
    const cardElement = fixture.debugElement.query(By.css('.user-card')).nativeElement;
    expect(cardElement).toBeTruthy();
    expect(cardElement.classList).toContain('user-card');
  });
});
