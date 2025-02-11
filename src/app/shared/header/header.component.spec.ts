import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {UserService} from '../../services/user.service';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {By} from '@angular/platform-browser';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => 'mock-value',
      },
    },
  };

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['setSearchQuery']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true))

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        FormsModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatAutocompleteModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideAnimationsAsync()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setSearchQuery with correct value after debounce', fakeAsync(() => {
    component.onSearchChange('octocat');
    tick(500);
    expect(userServiceSpy.setSearchQuery).toHaveBeenCalledWith('octocat');
  }));

  it('should navigate to home page if current route is not "/"', fakeAsync(() => {
    Object.defineProperty(routerSpy, 'url', { get: () => '/user-profile' });
    component.onSearchChange('octocat');
    tick(500);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should not navigate if already on home page', fakeAsync(() => {
    Object.defineProperty(routerSpy, 'url', { get: () => '/' });
    component.onSearchChange('octocat');
    tick(500);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('should update search term when user types in input', fakeAsync(() => {
    const inputDebugElement = fixture.debugElement.query(By.css('input'));
    inputDebugElement.nativeElement.value = 'octocat';
    inputDebugElement.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(500); // Aguarda o debounce

    expect(userServiceSpy.setSearchQuery).toHaveBeenCalledWith('octocat');
  }));

  it('should clean up observables on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next').and.callThrough();
    const completeSpy = spyOn(component['destroy$'], 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });


});
