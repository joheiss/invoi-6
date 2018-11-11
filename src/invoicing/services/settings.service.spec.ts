import {TestBed} from '@angular/core/testing';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {SettingsService} from './settings.service';

describe('Settings Service', () => {
  let service: SettingsService;
  let persistence: FbStoreService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FbStoreService,
          useValue: {
           assignCollection: jest.fn()
          }
        },
        SettingsService
      ]
    });

    persistence = TestBed.get(FbStoreService);
    service = TestBed.get(SettingsService);
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });
});
