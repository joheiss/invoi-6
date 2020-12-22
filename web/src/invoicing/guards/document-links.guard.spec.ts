import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../store';
import {DocumentLinksGuard} from './document-links.guard';

describe('Document Links Guard', () => {
  let store: Store<InvoicingState>;
  let guard: DocumentLinksGuard;

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
        DocumentLinksGuard
      ]
    });
    store = TestBed.inject(Store);
    guard = TestBed.inject(DocumentLinksGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });
});
