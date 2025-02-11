import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {UserService} from './user.service';
import {BehaviorSubject} from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let searchSubject: BehaviorSubject<string>;

  beforeEach(() => {
    searchSubject = new BehaviorSubject<string>('');

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: BehaviorSubject, useValue: searchSubject }
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setSearchQuery and emit the trimmed query', (done) => {
    const query = ' testQuery ';
    service.setSearchQuery(query);

    service.search$.subscribe(value => {
      expect(value).toBe('testQuery');
      done();
    });
  });

  it('should emit an empty string when setSearchQuery is called with empty string', (done) => {
    service.setSearchQuery('   ');

    service.search$.subscribe(value => {
      expect(value).toBe('');
      done();
    });
  });

});
