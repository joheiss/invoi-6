import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromDocumentLinks from '../reducers/document-links.reducer';

export const selectDocumentLinksState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.documentLinks
);

export const selectDocumentLinkEntities = createSelector(
  selectDocumentLinksState,
  fromDocumentLinks.selectDocumentLinkEntities
);

export const selectAllDocumentLinks = createSelector(
  selectDocumentLinksState,
  fromDocumentLinks.selectAllDocumentLinks
);

export const selectDocumentLinksLoaded = createSelector(
  selectDocumentLinksState,
  fromDocumentLinks.selectDocumentLinksLoaded
);




