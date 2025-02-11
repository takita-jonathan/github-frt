import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';
import {LoadingService} from './loading.service';
import {BehaviorSubject} from 'rxjs';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', [], {
      loading$: loadingSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [{ provide: LoadingService, useValue: loadingServiceSpy }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isLoading as false', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should update isLoading to true when LoadingService emits true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
  });

  it('should update isLoading to false when LoadingService emits false', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();

    loadingSubject.next(false);
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
  });
});
