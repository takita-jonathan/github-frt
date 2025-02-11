import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb-browser';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private db: PouchDB.Database<any>;

  constructor() {
    this.db = new PouchDB('github-frt-cache');
  }

  storeData<T>(id: string, data: T): Promise<any> {
    return this.db.put({
      _id: id,
      data: data
    });
  }

  getData<T>(id: string): Promise<T | null> {
    return this.db.get(id)
      .then(doc => doc.data)
      .catch(() => null);
  }

  deleteData(id: string): Promise<any> {
    return this.db.get(id)
      .then(doc => this.db.remove(doc))
      .catch(() => null);
  }
}
