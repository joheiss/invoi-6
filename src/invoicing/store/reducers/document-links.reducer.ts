import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {DocumentLink} from '../../models/document-link';
import * as fromDocLinks from '../actions/document-links.actions';

export interface DocumentLinkState extends EntityState<DocumentLink> {
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const documentLinkAdapter: EntityAdapter<DocumentLink> = createEntityAdapter<DocumentLink>({
  selectId: (documentLink: DocumentLink) => documentLink.path,
  sortComparer: (a: DocumentLink, b: DocumentLink) => a.path.localeCompare(b.path)
});

const initialState: DocumentLinkState = documentLinkAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: undefined
});

export function documentLinkReducer(state: DocumentLinkState = initialState, action: fromDocLinks.DocumentLinkAction): DocumentLinkState {
  switch (action.type) {

    case fromDocLinks.QUERY_DOCUMENT_LINKS: {
      return { ...state, loading: true, loaded: false, error: undefined };
    }

    case fromDocLinks.ADDED_DOCUMENT_LINK: {
      return documentLinkAdapter.addOne(action.payload, {...state, loaded: true, loading: false, error: undefined });
    }

    case fromDocLinks.MODIFIED_DOCUMENT_LINK: {
      return documentLinkAdapter.updateOne({ id: action.payload.path, changes: action.payload }, {...state, error: undefined });
    }

    case fromDocLinks.REMOVED_DOCUMENT_LINK: {
      return documentLinkAdapter.removeOne(action.payload.path, state);
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectDocumentLinkIds,
  selectEntities: selectDocumentLinkEntities,
  selectAll: selectAllDocumentLinks } = documentLinkAdapter.getSelectors();

export const selectDocumentLinksLoading = (state: DocumentLinkState) => state.loading;
export const selectDocumentLinksLoaded = (state: DocumentLinkState) => state.loaded;


