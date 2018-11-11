import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {InvoicesGuard} from './invoices.guard';

describe('Invoices Guard', () => {
  let store: Store<InvoicingState>;
  let guard: InvoicesGuard;

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
        InvoicesGuard
      ]
    });
    store = TestBed.get(Store);
    guard = TestBed.get(InvoicesGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });
});
