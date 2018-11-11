import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
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
    store = TestBed.get(Store);
    guard = TestBed.get(DocumentLinksGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });
});
