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
import {Contract} from '../../models/contract.model';
import {mockAllContracts, mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {selectAllDocumentLinks, selectDocumentLinkEntities, selectDocumentLinksLoaded} from './document-links.selectors';

describe('Document Links Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState();
  });

  describe('selectDocumentLinkEntities', () => {
    it('should return the entities object containing all document links', () => {
      expect(selectDocumentLinkEntities(state)).toEqual(state.invoicing.documentLinks.entities);
    });
  });

  describe('selectAllDocumentLinks', () => {
    it('should return an array containing all document links', () => {
      const expected = Object.keys(state.invoicing.documentLinks.entities)
        .map(k => state.invoicing.documentLinks.entities[k])
        .sort((a, b) => a.path.localeCompare(b.path));
      expect(selectAllDocumentLinks(state)).toEqual(expected);
    });
  });

  describe('selectDocumentLinksLoaded', () => {
    it('should return true ', () => {
      const expected = state.invoicing.documentLinks.loaded;
      expect(selectDocumentLinksLoaded(state)).toEqual(expected);
    });
  });
});
