import {createSelector} from '@ngrx/store';
import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromInvoices from '../reducers/invoices.reducer';
import {Invoice, InvoiceData, InvoiceStatus, mapInvoicesEntityToObjArray} from '../../models/invoice.model';

export const selectInvoiceState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.invoices
);

export const selectInvoiceIds = createSelector(
  selectInvoiceState,
  fromInvoices.selectInvoiceIds
);

export const selectInvoiceEntities = createSelector(
  selectInvoiceState,
  fromInvoices.selectInvoiceEntities
);

export const selectAllInvoices = createSelector(
  selectInvoiceState,
  fromInvoices.selectAllInvoices
);

export const selectAllInvoicesAsObjArray = createSelector(
  selectAllInvoices,
  invoices => invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectInvoicesTotal = createSelector(
  selectInvoiceState,
  fromInvoices.selectInvoicesTotal
);

export const selectInvoicesLoading = createSelector(
  selectInvoiceState,
  fromInvoices.selectInvoicesLoading
);

export const selectInvoicesLoaded = createSelector(
  selectInvoiceState,
  fromInvoices.selectInvoicesLoaded
);

export const selectCurrentInvoice = createSelector(
  selectInvoiceState,
  fromInvoices.selectCurrentInvoice
);

export const selectCurrentInvoiceAsObj = createSelector(
  selectCurrentInvoice,
  invoice => invoice && Invoice.createFromData(invoice)
);

export const selectInvoicesError = createSelector(
  selectInvoiceState,
  fromInvoices.selectInvoicesError
);

export const selectSelectedInvoice = createSelector(
  selectInvoiceEntities,
  fromRoot.getRouterState,
  (entity, router) => router.state && entity[router.state.params.id]
);

export const selectSelectedInvoiceAsObj = createSelector(
  selectSelectedInvoice,
  invoice => invoice && Invoice.createFromData(invoice)
);

export const selectOpenInvoices = createSelector(
  selectAllInvoicesAsObjArray,
  invoices => invoices.filter(invoice => invoice.isOpen()).map(invoice => invoice.data)
);

export const selectOpenInvoicesAsObjArray = createSelector(
  selectOpenInvoices,
  invoices => invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectBilledInvoices = createSelector(
  selectOpenInvoicesAsObjArray,
  invoices => invoices.filter(invoice => invoice.isBilled()).map(invoice => invoice.data)
);

export const selectBilledInvoicesAsObjArray = createSelector(
  selectBilledInvoices,
  invoices => invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectDueInvoices = createSelector(
  selectOpenInvoicesAsObjArray,
  invoices => invoices.filter(invoice => invoice.isDue()).map(invoice => invoice.data)
);

export const selectDueInvoicesAsObjArray = createSelector(
  selectDueInvoices,
  invoices => invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectPaidInvoices = createSelector(
  selectAllInvoicesAsObjArray,
  invoices => invoices.filter(invoice => invoice.isPaid()).map(invoice => invoice.data)
);

export const selectPaidInvoicesAsObjArray = createSelector(
  selectPaidInvoices,
  invoices => invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectInvoiceChangeable = createSelector(
  selectSelectedInvoice,
  invoice => invoice && invoice.status == InvoiceStatus.created
);


