import {TestBed} from '@angular/core/testing';

import {ConfigService} from './config.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load config.json correctly', async () => {
    const mockConfig = { API_URL: 'https://api.github.com', GITHUB_TOKEN: 'fake-token' };

    const loadConfigPromise = service.loadConfig();
    const req = httpMock.expectOne('/assets/config.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);

    await loadConfigPromise;

    expect(service.getConfig()).toEqual(mockConfig);
  });

  it('should return empty object if config.json fails to load', async () => {
    const loadConfigPromise = service.loadConfig();
    const req = httpMock.expectOne('/assets/config.json');
    req.error(new ErrorEvent('Network error'), { status: 404 });

    await loadConfigPromise;

    expect(service.getConfig()).toEqual({});
  });
});
