import {TestBed} from '@angular/core/testing';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {NumberRangesService} from './numberRanges.service';

describe('Number Ranges Service', () => {
  let service: NumberRangesService;
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
        NumberRangesService
      ]
    });

    persistence = TestBed.inject(FbStoreService);
    service = TestBed.inject(NumberRangesService);
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });
});
