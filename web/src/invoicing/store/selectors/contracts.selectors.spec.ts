import {mockState} from '../../../test/factories/mock-state';
import {
  selectActiveContracts,
  selectAllContracts,
  selectAllContractsAsObjArray,
  selectContractEntities,
  selectContractsLoaded,
  selectCurrentContract,
  selectCurrentContractAsObj,
  selectExpiredContracts,
  selectInvoiceableContracts,
  selectSelectedContract
} from './contracts.selectors';
import {mockAllContracts, mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {ContractFactory} from 'jovisco-domain';

describe('Contracts Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState();
  });

  describe('selectContractEntities', () => {
    it('should return the entities object containing all contracts', () => {
      expect(selectContractEntities(state)).toEqual(state.invoicing.contracts.entities);
    });
  });

  describe('selectAllContracts', () => {
    it('should return an array containing all contracts', () => {
      const expected = Object.keys(state.invoicing.contracts.entities)
        .map(k => state.invoicing.contracts.entities[k])
        .sort((a, b) => b.id.localeCompare(a.id));
      expect(selectAllContracts(state)).toEqual(expected);
    });
  });

  describe('selectAllContractsAsObjArray', () => {
    it('should return an array of contract objects', () => {
      const expected = ContractFactory.fromEntity(state.invoicing.contracts.entities)
        .sort((a, b) => b.header.id.localeCompare(a.header.id));
      expect(selectAllContractsAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectContractsLoaded', () => {
    it('should return true ', () => {
      const expected = state.invoicing.contracts.loaded;
      expect(selectContractsLoaded(state)).toEqual(expected);
    });
  });

  describe('selectCurrentContract', () => {
    it('should return the currently selected contract', () => {
      const expected = mockSingleContract();
      expect(selectCurrentContract(state)).toEqual(expected);
    });
  });

  describe('selectCurrentContractAsObj', () => {
    it('should return the currently selected contract as object', () => {
      const expected = ContractFactory.fromData(mockSingleContract());
      expect(selectCurrentContractAsObj(state)).toEqual(expected);
    });
  });

  describe('selectSelectedContract', () => {
    it('should return the currently selected contract', () => {
      state.routerReducer.state = { url: '/contracts', params: { id: '4909' } } as any;
      const expected = mockSingleContract();
      expect(selectSelectedContract(state)).toEqual(expected);
    });
  });

  describe('selectActiveContracts', () => {
    it('should return all active contracts', () => {
      const expected = mockAllContracts()
        .map(c => ContractFactory.fromData(c))
        .filter(c => c.term.isActive || c.term.isFuture)
        .map(c => c.data);
      expect(selectActiveContracts(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceableContracts', () => {
    it('should return all invoiceable contracts', () => {
      const expected = mockAllContracts()
        .map(c => ContractFactory.fromData(c))
        .filter(c => c.term.isInvoiceable || c.term.isFuture)
        .map(c => c.data);
      expect(selectInvoiceableContracts(state)).toEqual(expected);
    });
  });

  describe('selectExpiredContracts', () => {
    it('should return all expired contracts', () => {
      const expected = mockAllContracts()
        .map(c => ContractFactory.fromData(c))
        .filter(c => !c.term.isActive && !c.term.isFuture)
        .map(c => c.data);
      expect(selectExpiredContracts(state)).toEqual(expected);
    });
  });
});
