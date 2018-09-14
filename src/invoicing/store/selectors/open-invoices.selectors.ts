import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromOpenInvoices from '../reducers/open-invoices.reducer';

export const selectOpenInvoiceState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.openInvoices
);

export const selectOpenInvoiceIds = createSelector(
  selectOpenInvoiceState,
  fromOpenInvoices.selectOpenInvoiceIds
);

export const selectOpenInvoiceEntities = createSelector(
  selectOpenInvoiceState,
  fromOpenInvoices.selectOpenInvoiceEntities
);

export const selectAllOpenInvoices = createSelector(
  selectOpenInvoiceState,
  fromOpenInvoices.selectAllOpenInvoices
);

export const selectOpenInvoiceTotal = createSelector(
  selectOpenInvoiceState,
  fromOpenInvoices.selectOpenInvoiceTotal
);

export const selectOpenInvoicesLoading = createSelector(
  selectOpenInvoiceState,
  fromOpenInvoices.selectOpenInvoicesLoading
);

export const selectOpenInvoicesLoaded = createSelector(
  selectOpenInvoiceState,
  fromOpenInvoices.selectOpenInvoicesLoaded)
;

export const selectOpenInvoiceError = createSelector(
  selectOpenInvoiceState,
  fromOpenInvoices.selectOpenInvoicesError
);




