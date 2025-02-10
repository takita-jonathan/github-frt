import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private searchSubject = new BehaviorSubject<string>('');
  public search$ = this.searchSubject.asObservable();

  setSearchQuery(query: string) {
    this.searchSubject.next(query.trim());
  }

}
