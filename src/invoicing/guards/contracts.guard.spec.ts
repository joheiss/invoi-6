import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {ContractsGuard} from './contracts.guard';

describe('Contracts Guard', () => {
  let store: Store<InvoicingState>;
  let guard: ContractsGuard;

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
        ContractsGuard
      ]
    });
    store = TestBed.get(Store);
    guard = TestBed.get(ContractsGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });
});
