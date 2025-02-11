import {TestBed} from '@angular/core/testing';
import {CacheService} from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let dbMock: jasmine.SpyObj<any>;

  beforeEach(() => {
    dbMock = jasmine.createSpyObj('PouchDB', ['put', 'get', 'remove']);

    TestBed.configureTestingModule({
      providers: [
        CacheService
      ]
    });
    service = TestBed.inject(CacheService);
    service['db'] = dbMock
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store data', (done) => {
    const mockData = { name: 'octocat', login: 'octocat' };
    const mockId = 'user_octocat';

    dbMock.put.and.returnValue(Promise.resolve({ ok: true }));

    service.storeData(mockId, mockData).then(result => {
      expect(dbMock.put).toHaveBeenCalledWith({
        _id: mockId,
        data: mockData
      });
      done();
    });
  });

  it('should retrieve data', (done) => {
    const mockId = 'user_octocat';
    const mockData = { name: 'octocat', login: 'octocat' };

    dbMock.get.and.returnValue(Promise.resolve({ data: mockData }));

    service.getData(mockId).then(data => {
      expect(dbMock.get).toHaveBeenCalledWith(mockId);
      expect(data).toEqual(mockData);
      done();
    });
  });

  it('should return null if data is not found', (done) => {
    const mockId = 'user_octocat';

    dbMock.get.and.returnValue(Promise.reject('Not found'));

    service.getData(mockId).then(data => {
      expect(dbMock.get).toHaveBeenCalledWith(mockId);
      expect(data).toBeNull();
      done();
    });
  });

  it('should delete data', (done) => {
    const mockId = 'user_octocat';

    dbMock.get.and.returnValue(Promise.resolve({ _id: mockId, _rev: '1-abc' }));
    dbMock.remove.and.returnValue(Promise.resolve({ ok: true }));

    service.deleteData(mockId).then(result => {
      expect(dbMock.get).toHaveBeenCalledWith(mockId);
      expect(dbMock.remove).toHaveBeenCalledWith({ _id: mockId, _rev: '1-abc' });
      done();
    });
  });
});
