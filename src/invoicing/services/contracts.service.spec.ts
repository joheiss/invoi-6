import {TestBed} from '@angular/core/testing';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {ContractsService} from './contracts.service';

describe('Contracts Service', () => {
  let service: ContractsService;
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
        ContractsService
      ]
    });

    persistence = TestBed.get(FbStoreService);
    service = TestBed.get(ContractsService);
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });
});
