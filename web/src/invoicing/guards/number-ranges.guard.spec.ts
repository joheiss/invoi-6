import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../store';
import {NumberRangesGuard} from './number-ranges.guard';

describe('Number Ranges Guard', () => {
  let store: Store<InvoicingState>;
  let guard: NumberRangesGuard;

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
        NumberRangesGuard
      ]
    });
    store = TestBed.inject(Store);
    guard = TestBed.inject(NumberRangesGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });
});
