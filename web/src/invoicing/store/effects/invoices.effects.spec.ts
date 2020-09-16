import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers';
import {InvoicesService} from '../../services';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import {
  CopyInvoiceSuccess,
  CreateInvoice,
  CreateInvoiceFail, CreateInvoicePdf, CreateInvoicePdfFail, CreateInvoicePdfSuccess,
  CreateInvoiceSuccess,
  DeleteInvoice,
  DeleteInvoiceFail,
  DeleteInvoiceSuccess,
  NewInvoiceSuccess, NewQuickInvoiceSuccess, QueryInvoices,
  UpdateInvoice,
  UpdateInvoiceFail,
  UpdateInvoiceSuccess
} from '../actions';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {firestore} from 'firebase';
import {Go, OpenSnackBar, StartSpinning, StopSpinning} from '../../../app/store/actions';
import {InvoicesEffects} from './invoices.effects';
import {mockAllInvoices, mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';

describe('Invoices Effects', () => {

  let effects: InvoicesEffects;
  let actions: Observable<any>;
  let store: Store<AppState>;
  let invoicesService: InvoicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        InvoicesEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => of(mockAuth()[0]))
          }
        },
        {
          provide: InvoicesService,
          useValue: {
            queryAll: jest.fn(() => of(mockAllInvoices().slice(0, 3))),
            create: jest.fn(),
            createInvoicePDF: jest.fn(),
            delete: jest.fn(),
            sendInvoiceEmail: jest.fn(),
            update: jest.fn(),
            getMessage: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.get(InvoicesEffects);
    store = TestBed.get(Store);
    invoicesService = TestBed.get(InvoicesService);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should be created', async () => {
    return expect(effects).toBeTruthy();
  });

  describe('queryInvoices$', () => {
    it('should return an array of Invoice Added actions', async () => {
      const action = new QueryInvoices();
      actions = hot('-a', {a: action});
      const outcome = mockAllInvoices().slice(0, 3).map(i => {
        const type = 'Added';
        const payload = {doc: {id: i.id, data: jest.fn(() => i)}};
        payload.doc.data().issuedAt = firestore.Timestamp.fromDate(payload.doc.data().issuedAt);
        return {type, payload};
      });
      const mapped = mockAllInvoices().slice(0, 3).map(i => {
        const type = '[Invoicing] Invoice Added';
        return {type, payload: i};
      });
      const expected = cold('-(cde)', {c: mapped[0], d: mapped[1], e: mapped[2]});
      invoicesService.queryAll = jest.fn(() => of(outcome));
      return expect(effects.queryInvoices$).toBeObservable(expected);
    });
  });

  describe('updateInvoice$', () => {
    it('should return an UpdateInvoiceSuccess action and dispatch StartSpinning action', async () => {
      const invoice = mockSingleInvoice();
      const action = new UpdateInvoice(invoice);
      actions = hot('-a', {a: action});
      const outcome = new UpdateInvoiceSuccess(invoice);
      const expected = cold('--c', {c: outcome});
      invoicesService.update = jest.fn(() => cold('-b|', {b: invoice}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateInvoice$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an UpdateInvoiceFail action and dispatch StartSpinning action', async () => {
      const invoice = mockSingleInvoice();
      const action = new UpdateInvoice(invoice);
      actions = hot('-a', {a: action});
      const error = new Error('Update failed');
      const outcome = new UpdateInvoiceFail(error);
      const expected = cold('--c', {c: outcome});
      invoicesService.update = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateInvoice$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('updateInvoiceSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const invoice = mockSingleInvoice();
      const action = new UpdateInvoiceSuccess(invoice);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
        c: new Go({path: ['/invoicing/invoices']})
      });
      return expect(effects.updateInvoiceSuccess$).toBeObservable(expected);
    });
  });

  describe('updateInvoiceFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Update failed');
      const action = new UpdateInvoiceFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.updateInvoiceFail$).toBeObservable(expected);
    });
  });

  describe('createInvoice$', () => {

    it('should return a CreateInvoiceSuccess action and dispatch StartSpinning action', async () => {
      const invoice = mockSingleInvoice();
      const newId = (+invoice.id + 1).toString();
      const newInvoice = {...invoice, id: newId};
      const action = new CreateInvoice(newInvoice);
      actions = hot('-a', {a: action});
      const outcome = new CreateInvoiceSuccess(newInvoice);
      const expected = cold('--c', {c: outcome});
      invoicesService.create = jest.fn(() => cold('-b|', {b: newInvoice}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createInvoice$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return a CreateInvoiceFail action and dispatch StartSpinning action', async () => {
      const newInvoice = {...mockSingleInvoice(), id: 'Wrong'};
      const action = new CreateInvoice(newInvoice);
      actions = hot('-a', {a: action});
      const error = new Error('Create failed');
      const outcome = new CreateInvoiceFail(error);
      const expected = cold('--c', {c: outcome});
      invoicesService.create = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createInvoice$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('createInvoiceSuccess$', () => {

    it('should return an array of actions containing StopSpinning and Go action', async () => {
      const invoice = mockSingleInvoice();
      const action = new CreateInvoiceSuccess(invoice);
      actions = hot('-a', {a: action});
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new Go({path: ['/invoicing/invoices', invoice.id]})
      });
      return expect(effects.createInvoiceSuccess$).toBeObservable(expected);
    });
  });

  describe('createInvoiceFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Create failed');
      const action = new CreateInvoiceFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.createInvoiceFail$).toBeObservable(expected);
    });
  });

  describe('deleteInvoice$', () => {
    it('should return an DeleteInvoiceSuccess action', async () => {
      const invoice = mockSingleInvoice();
      const action = new DeleteInvoice(invoice);
      actions = hot('-a', {a: action});
      const outcome = new DeleteInvoiceSuccess(invoice);
      const expected = cold('--c', {c: outcome});
      invoicesService.delete = jest.fn(() => cold('-b|', {b: invoice}));
      return expect(effects.deleteInvoice$).toBeObservable(expected);
    });

    it('should return an DeleteInvoiceFail action ', async () => {
      const invoice = mockSingleInvoice();
      const action = new DeleteInvoice(invoice);
      actions = hot('-a', {a: action});
      const error = new Error('Delete failed');
      const outcome = new DeleteInvoiceFail(error);
      const expected = cold('--c', {c: outcome});
      invoicesService.delete = jest.fn(() => cold('-#|', {}, error));
      return expect(effects.deleteInvoice$).toBeObservable(expected);
    });
  });

  describe('deleteInvoiceSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const invoice = mockSingleInvoice();
      const action = new DeleteInvoiceSuccess(invoice);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
        c: new Go({path: ['/invoicing/invoices']})
      });
      return expect(effects.deleteInvoiceSuccess$).toBeObservable(expected);
    });
  });

  describe('deleteInvoiceFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Delete failed');
      const action = new DeleteInvoiceFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.deleteInvoiceFail$).toBeObservable(expected);
    });
  });

  describe('copyInvoiceSuccess$', () => {

    it('should return a Go action', async () => {
      const invoice = mockSingleInvoice();
      const action = new CopyInvoiceSuccess(invoice);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new Go({path: ['/invoicing/invoices', 'copy']})
      });
      return expect(effects.copyInvoiceSuccess$).toBeObservable(expected);
    });
  });

  describe('newInvoiceSuccess$', () => {

    it('should return a Go action', async () => {
      const invoice = mockSingleInvoice();
      const action = new NewInvoiceSuccess(invoice);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new Go({path: ['/invoicing/invoices', 'new']})
      });
      return expect(effects.newInvoiceSuccess$).toBeObservable(expected);
    });
  });

  describe('newQuickInvoiceSuccess$', () => {

    it('should return a Go action', async () => {
      const invoice = mockSingleInvoice();
      const action = new NewQuickInvoiceSuccess(invoice);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new Go({path: ['/invoicing/invoices', 'quick']})
      });
      return expect(effects.newQuickInvoiceSuccess$).toBeObservable(expected);
    });
  });

  describe('createInvoicePdf$', () => {
    it('should return a CreateInvoicePdfSuccess action and dispatch StartSpinning', async () => {
      const invoice = mockSingleInvoice();
      const action = new CreateInvoicePdf(invoice);
      actions = hot('-a', {a: action});
      const outcome = new CreateInvoicePdfSuccess(invoice);
      const expected = cold('--c', {c: outcome});
      invoicesService.createInvoicePDF = jest.fn(() => cold('-b|', {b: invoice}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createInvoicePdf$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());

    });

    it('should return a CreateInvoicePdfFail action and dispatch StartSpinning', async () => {
      const invoice = mockSingleInvoice();
      const action = new CreateInvoicePdf(invoice);
      actions = hot('-a', {a: action});
      const error = new Error('Create PDF failed');
      const outcome = new CreateInvoicePdfFail(error);
      const expected = cold('--c', {c: outcome});
      invoicesService.createInvoicePDF = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createInvoicePdf$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('createInvoicePdfSuccess$', () => {

    it('should return an array of actions containing OpenSnackBar', async () => {
      const invoice = mockSingleInvoice();
      const action = new CreateInvoicePdfSuccess(invoice);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
      });
      return expect(effects.createInvoicePdfSuccess$).toBeObservable(expected);
    });
  });

  describe('createInvoicePdfFail$', () => {

    it('should return an array of actions containing OpenSnackBar', async () => {
      const invoice = mockSingleInvoice();
      const action = new CreateInvoicePdfFail(invoice);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
      });
      return expect(effects.createInvoicePdfFail$).toBeObservable(expected);
    });
  });

});
