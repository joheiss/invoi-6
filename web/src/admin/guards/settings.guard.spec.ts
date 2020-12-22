import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../../invoicing/store';
import {SettingsGuard} from './settings.guard';

describe('Settings Guard', () => {
  let store: Store<InvoicingState>;
  let guard: SettingsGuard;

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
        SettingsGuard
      ]
    });
    store = TestBed.inject(Store);
    guard = TestBed.inject(SettingsGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });
});
