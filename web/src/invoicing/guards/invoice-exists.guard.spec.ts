import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {of} from 'rxjs/index';
import {map, take, tap} from 'rxjs/operators';
import {SelectInvoice} from '../store';
import {InvoiceExistsGuard} from './invoice-exists.guard';
import {mockAllInvoices, mockInvoicesEntity} from '../../test/factories/mock-invoices.factory';
import {InvoiceData} from 'jovisco-domain';

describe('Invoice Exists Guard', () => {
  let store: Store<InvoicingState>;
  let guard: InvoiceExistsGuard;

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
        InvoiceExistsGuard
      ]
    });
    store = TestBed.get(Store);
    guard = TestBed.get(InvoiceExistsGuard);
  });

  it('should create the guard', () => {
    expect(guard).toBeDefined();
  });

  describe('check if invoice exists', async () => {
    let allInvoices: InvoiceData[];
    let lastInvoice: InvoiceData;

    beforeEach(() => {
      allInvoices = mockAllInvoices();
      lastInvoice = allInvoices[0];
    });

    it('should return true if requested object exists', done => {
      const action = new SelectInvoice(lastInvoice);
      const spy = jest.spyOn(store, 'dispatch');
      const id = lastInvoice.id;
      of(mockInvoicesEntity())
        .pipe(
          tap(entity => store.dispatch(new SelectInvoice(entity[id]))),
          map(entity => !!entity[id]),
          take(1)
        ).subscribe(exists => {
        expect(exists).toBe(true);
        expect(spy).toHaveBeenCalledWith(action);
        done();
      });
    });

    it('should return false if requested object does not exist', done => {
      const action = new SelectInvoice(undefined);
      const spy = jest.spyOn(store, 'dispatch');
      const id = 'not_exists';
      of(mockInvoicesEntity())
        .pipe(
          tap(entity => store.dispatch(new SelectInvoice(entity[id]))),
          map(entity => !!entity[id]),
          take(1)
        ).subscribe(exists => {
        expect(exists).toBe(false);
        expect(spy).toHaveBeenCalledWith(action);
        done();
      });
    });
  });
});
