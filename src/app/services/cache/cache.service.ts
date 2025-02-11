import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb-browser';
import {catchError, from, Observable, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private db: PouchDB.Database<any>;
  private TTL: number = 900000;

  constructor() {
    this.db = new PouchDB('github-frt-cache');
  }

  storeData<T>(id: string, data: T): Observable<any> {
    const timestamp = new Date().getTime();
    const doc = {
      _id: id,
      data: data,
      timestamp: timestamp
    };

    return from(this.db.put(doc));
  }

  getData<T>(id: string): Observable<T | null> {
    return from(this.db.get(id))
      .pipe(
        switchMap(doc => {
          const currentTime = new Date().getTime();
          const isExpired = currentTime - doc.timestamp > this.TTL;

          if (isExpired) {
            return from(this.deleteData(id)).pipe(
              switchMap(() => [null])
            );
          } else {
            return [doc.data];
          }
        }),
        catchError(() => [null])
      );
  }

  deleteData(id: string): Observable<any> {
    return from(this.db.get(id))
      .pipe(
        switchMap(doc => from(this.db.remove(doc))),
        catchError(() => [null])
      );
  }

}
