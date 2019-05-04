import {
  AddedInvoice,
  ChangeInvoiceSuccess,
  CopyInvoiceSuccess,
  ModifiedInvoice,
  NewInvoiceSuccess,
  QueryInvoices,
  RemovedInvoice,
  SelectInvoice,
} from '../actions';
import {invoiceAdapter, invoiceReducer, InvoiceState} from './invoices.reducer';
import {mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';

describe('Invoices Reducer', () => {

  const initialState: InvoiceState = invoiceAdapter.getInitialState({
    loading: false,
    loaded: false,
    current: undefined,
    error: undefined
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'Noop' } as any;
      const result = invoiceReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Query Invoices Action', () => {
    it('should toggle the loading state', () => {
      const action = new QueryInvoices();
      const result = invoiceReducer(undefined, action);
      expect(result).toEqual({...initialState, loading: true });
    });
  });

  describe('Added Invoice Event', () => {
    it('should toggle the loading state and add a invoice to the state', () => {
      const invoice = mockSingleInvoice();
      const action = new AddedInvoice(invoice);
      const result = invoiceReducer(undefined, action);
      expect(result).toEqual({
        ...initialState,
        entities: { [invoice.id]: invoice },
        ids: [invoice.id],
        loading: false,
        loaded: true
      });
    });
  });

  describe('Modified Invoice Event', () => {
    it('should update the invoice in the state', () => {
      const invoice = mockSingleInvoice();
      const someState = {
        ...initialState,
        entities: { [invoice.id]: invoice },
        ids: [invoice.id],
        loading: false,
        loaded: true,
        current: { isDirty: false, invoice: invoice }
      };
      const modifiedInvoice = { ...invoice, internalText: '... modified' };
      const action = new ModifiedInvoice(modifiedInvoice);
      const result = invoiceReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: { [invoice.id]: modifiedInvoice },
        current: { isDirty: false, invoice: modifiedInvoice }
      });
    });
  });

  describe('Removed Invoice Event', () => {
    it('should remove the invoice from the state', () => {
      const invoice = mockSingleInvoice();
      const someState = {
        ...initialState,
        entities: { [invoice.id]: invoice },
        ids: [invoice.id],
        loading: false,
        loaded: true
      };
      const action = new RemovedInvoice(invoice);
      const result = invoiceReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: {},
        ids: []
      });
    });
  });

  describe('Copy Invoice Success Event', () => {
    it('should set the current invoice in state', () => {
      const invoice = mockSingleInvoice();
      const someState = {
        ...initialState,
        entities: { [invoice.id]: invoice },
        ids: [invoice.id],
        loading: false,
        loaded: true
      };
      const action = new CopyInvoiceSuccess(invoice);
      const result = invoiceReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, invoice: invoice },
        error: undefined
      });
    });
  });

  describe('New Invoice Success Event', () => {
    it('should set the current invoice in state', () => {
      const invoice = mockSingleInvoice();
      const someState = {
        ...initialState,
        entities: { [invoice.id]: invoice },
        ids: [invoice.id],
        loading: false,
        loaded: true
      };
      const action = new NewInvoiceSuccess(invoice);
      const result = invoiceReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, invoice: invoice },
        error: undefined
      });
    });
  });

  describe('Select Invoice Command', () => {
    it('should set the current invoice in state', () => {
      const invoice = mockSingleInvoice();
      const someState = {
        ...initialState,
        entities: { [invoice.id]: invoice },
        ids: [invoice.id],
        loading: false,
        loaded: true
      };
      const action = new SelectInvoice(invoice);
      const result = invoiceReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: false, invoice: invoice },
        error: undefined
      });
    });
  });

  describe('Change Invoice Success Event', () => {
    it('should set the current invoice in state', () => {
      const invoice = mockSingleInvoice();
      const someState = {
        ...initialState,
        entities: { [invoice.id]: invoice },
        ids: [invoice.id],
        loading: false,
        loaded: true
      };
      const action = new ChangeInvoiceSuccess(invoice);
      const result = invoiceReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, invoice: invoice },
        error: undefined
      });
    });
  });
});
