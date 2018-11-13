import {AddedDocumentLink, ModifiedDocumentLink, QueryDocumentLinks, RemovedDocumentLink} from '../actions';
import {documentLinkAdapter, documentLinkReducer, DocumentLinkState} from './document-links.reducer';
import {mockSingleDocumentLink} from '../../../test/factories/mock-document-links.factory';
import {DocumentLinkType} from '../../models/document-link';

describe('Document Links Reducer', () => {

  const initialState: DocumentLinkState = documentLinkAdapter.getInitialState({
    loading: false,
    loaded: false,
    error: undefined
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'Noop' } as any;
      const result = documentLinkReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Query Document Links Action', () => {
    it('should toggle the loading state', () => {
      const action = new QueryDocumentLinks();
      const result = documentLinkReducer(undefined, action);
      expect(result).toEqual({...initialState, loading: true });
    });
  });

  describe('Added Document Link Event', () => {
    it('should toggle the loading state and add a document link to the state', () => {
      const docLink = mockSingleDocumentLink();
      const action = new AddedDocumentLink(docLink);
      const result = documentLinkReducer(undefined, action);
      expect(result).toEqual({
        ...initialState,
        entities: { [docLink.path]: docLink },
        ids: [docLink.path],
        loading: false,
        loaded: true
      });
    });
  });

  describe('Modified Document Link Event', () => {
    it('should update the document link in the state', () => {
      const docLink = mockSingleDocumentLink();
      const someState = {
        ...initialState,
        entities: { [docLink.path]: docLink },
        ids: [docLink.path],
        loading: false,
        loaded: true
      };
      const modifiedDocLink = { ...docLink, type: DocumentLinkType.ServiceConfirmation };
      const action = new ModifiedDocumentLink(modifiedDocLink);
      const result = documentLinkReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: { [docLink.path]: modifiedDocLink }
      });
    });
  });

  describe('Removed Document Link Event', () => {
    it('should remove the document link from the state', () => {
      const docLink = mockSingleDocumentLink();
      const someState = {
        ...initialState,
        entities: { [docLink.path]: docLink },
        ids: [docLink.path],
        loading: false,
        loaded: true
      };
      const action = new RemovedDocumentLink(docLink);
      const result = documentLinkReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: {},
        ids: []
      });
    });
  });
});
