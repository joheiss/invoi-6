import {TestBed} from '@angular/core/testing';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {ReceiversService} from './receivers.service';

describe('Receivers Service', () => {
  let service: ReceiversService;
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
        ReceiversService
      ]
    });

    persistence = TestBed.get(FbStoreService);
    service = TestBed.get(ReceiversService);
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });
});
