import {mockState} from '../../../test/factories/mock-state';
import {
  selectAllInvoices,
  selectAllInvoicesAsObjArray,
  selectBilledInvoices,
  selectCurrentInvoice,
  selectCurrentInvoiceAsObj,
  selectDueInvoices,
  selectInvoiceChangeable,
  selectInvoiceEntities,
  selectInvoicesLoaded,
  selectOpenInvoices,
  selectOpenInvoicesAsObjArray,
  selectPaidInvoices,
  selectSelectedInvoice,
} from './invoices.selectors';
import {mockAllInvoices, mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';
import {InvoiceFactory} from 'jovisco-domain';

describe('Invoices Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState();
  });

  describe('selectInvoiceEntities', () => {
    it('should return the entities object containing all invoices', () => {
      expect(selectInvoiceEntities(state)).toEqual(state.invoicing.invoices.entities);
    });
  });

  describe('selectAllInvoices', () => {
    it('should return an array containing all invoices', () => {
      const expected = Object.keys(state.invoicing.invoices.entities)
        .map(k => state.invoicing.invoices.entities[k])
        .sort((a: any, b: any) => {
          const result = b.issuedAt.getTime() - a.issuedAt.getTime();
          return result ? result : a.id.localeCompare(b.id);
        });
      expect(selectAllInvoices(state)).toEqual(expected);
    });
  });

  describe('selectAllInvoicesAsObjArray', () => {
    it('should return an array of invoice objects', () => {
      const expected = InvoiceFactory.fromEntity(state.invoicing.invoices.entities)
        .sort((a: any, b: any) => {
          const result = b.header.issuedAt.getTime() - a.header.issuedAt.getTime();
          return result ? result : a.header.id.localeCompare(b.header.id);
        });
      expect(selectAllInvoicesAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectInvoicesLoaded', () => {
    it('should return true ', () => {
      const expected = state.invoicing.invoices.loaded;
      expect(selectInvoicesLoaded(state)).toEqual(expected);
    });
  });

  describe('selectCurrentInvoice', () => {
    it('should return the currently selected invoice', () => {
      const expected = mockSingleInvoice();
      expect(selectCurrentInvoice(state)).toEqual(expected);
    });
  });

  describe('selectCurrentInvoiceAsObj', () => {
    it('should return the currently selected invoice as object', () => {
      const expected = InvoiceFactory.fromData(mockSingleInvoice());
      expect(selectCurrentInvoiceAsObj(state)).toEqual(expected);
    });
  });

  describe('selectSelectedInvoice', () => {
    it('should return the currently selected invoice', () => {
      state.routerReducer.state = {url: '/invoices', params: {id: '5901'}} as any;
      const expected = mockSingleInvoice();
      expect(selectSelectedInvoice(state).id).toEqual(expected.id);
    });
  });

  describe('selectOpenInvoices', () => {
    it('should return all open invoices', () => {
      const expected = InvoiceFactory.fromDataArray(mockAllInvoices())
        .filter(i => i.isOpen())
        .map(i => i.data)
        .sort((a: any, b: any) => {
          const result = b.issuedAt.getTime() - a.issuedAt.getTime();
          return result ? result : a.id.localeCompare(b.id);
        });
      expect(selectOpenInvoices(state)).toEqual(expected);
    });
  });

  describe('selectOpenInvoicesAsObjArray', () => {
    it('should return all open invoices', () => {
      const expected = mockAllInvoices()
        .map(i => InvoiceFactory.fromData(i))
        .filter(i => i.isOpen())
        .sort((a: any, b: any) => {
          const result = b.header.issuedAt.getTime() - a.header.issuedAt.getTime();
          return result ? result : a.header.id.localeCompare(b.header.id);
        });
      expect(selectOpenInvoicesAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectBilledInvoices', () => {
    it('should return all billed invoices', () => {
      const expected = mockAllInvoices()
        .map(i => InvoiceFactory.fromData(i))
        .filter(i => i.isBilled())
        .map(i => i.data);
      expect(selectBilledInvoices(state)).toEqual(expected);
    });
  });

  describe('selectDueInvoices', () => {
    it('should return all due invoices', () => {
      const expected = mockAllInvoices()
        .map(i => InvoiceFactory.fromData(i))
        .filter(i => i.isDue())
        .map(i => i.data)
        .sort((a: any, b: any) => {
          const result = b.issuedAt.getTime() - a.issuedAt.getTime();
          return result ? result : a.id.localeCompare(b.id);
        });
      expect(selectDueInvoices(state)).toEqual(expected);
    });
  });

  describe('selectPaidInvoices', () => {
    it('should return all paid invoices', () => {
      const expected = mockAllInvoices()
        .map(i => InvoiceFactory.fromData(i))
        .filter(i => i.isPaid())
        .map(i => i.data);
      expect(selectPaidInvoices(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceChangeable', () => {
    it('should return true - if invoice is changeable', () => {
      state.routerReducer.state = {url: '/invoices', params: {id: '5901'}} as any;
      expect(selectInvoiceChangeable(state)).toEqual(true);
    });
  });

});
