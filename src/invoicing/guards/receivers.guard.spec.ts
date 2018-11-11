import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {ReceiversGuard} from './receivers.guard';

describe('Receivers Guard', () => {
  let store: Store<InvoicingState>;
  let guard: ReceiversGuard;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          },
        },
        ReceiversGuard
      ]
    });
    store = TestBed.get(Store);
    guard = TestBed.get(ReceiversGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });
});
