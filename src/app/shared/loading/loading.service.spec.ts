import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with loading$ as false', (done) => {
    service.loading$.subscribe((isLoading) => {
      expect(isLoading).toBeFalse();
      done();
    });
  });

  it('should set loading$ to true when show() is called', (done) => {
    service.show();
    service.loading$.subscribe((isLoading) => {
      expect(isLoading).toBeTrue();
      done();
    });
  });

  it('should set loading$ to false when hide() is called', (done) => {
    service.show();
    service.hide();

    service.loading$.subscribe((isLoading) => {
      expect(isLoading).toBeFalse();
      done();
    });
  });

  it('should emit values correctly when show() and hide() are called in sequence', (done) => {
    const emittedValues: boolean[] = [];

    service.loading$.subscribe((value) => {
      emittedValues.push(value);
      if (emittedValues.length === 3) {
        expect(emittedValues).toEqual([false, true, false]);
        done();
      }
    });

    service.show();
    service.hide();
  });
});
