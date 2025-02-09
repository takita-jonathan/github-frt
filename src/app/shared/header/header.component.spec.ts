import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import {UserService} from '../../services/user.service';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {By} from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['setUsername']);

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        FormsModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        provideAnimationsAsync()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call setUsername if username is empty', () => {
    component.username = '   ';
    component.searchUser();
    expect(userServiceSpy.setUsername).not.toHaveBeenCalled();
  });

  it('must call setUsername with the correct value', () => {
    component.username = 'octocat';
    component.searchUser();
    expect(userServiceSpy.setUsername).toHaveBeenCalledWith('octocat');
  });

  it('must call searchUser when pressing enter in input', () => {
    const inputDebugElement = fixture.debugElement.query(By.css('input'));
    inputDebugElement.nativeElement.value = 'octocat';
    inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    inputDebugElement.triggerEventHandler('keyup.enter', {});

    expect(userServiceSpy.setUsername).toHaveBeenCalledWith('octocat');
  });
});
