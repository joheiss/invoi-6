import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import * as fromNumberRanges from './number-ranges.reducer';
import * as fromReceivers from './receivers.reducer';
import * as fromContracts from './contracts.reducer';
import * as fromInvoices from './invoices.reducer';
import * as fromDocumentLinks from './document-links.reducer';
import * as fromSettings from './settings.reducer';
import * as fromRevenues from './revenues.reducer';
import * as fromOpenInvoices from './open-invoices.reducer';

export interface InvoicingState {
  numberRanges: fromNumberRanges.NumberRangeState;
  receivers: fromReceivers.ReceiverState;
  contracts: fromContracts.ContractState;
  invoices: fromInvoices.InvoiceState;
  documentLinks: fromDocumentLinks.DocumentLinkState;
  settings: fromSettings.SettingState;
  revenues: fromRevenues.RevenueState;
  openInvoices: fromOpenInvoices.OpenInvoiceState;
}

export const reducers: ActionReducerMap<InvoicingState> = {
  numberRanges: fromNumberRanges.numberRangeReducer,
  receivers: fromReceivers.receiverReducer,
  contracts: fromContracts.contractReducer,
  invoices: fromInvoices.invoiceReducer,
  documentLinks: fromDocumentLinks.documentLinkReducer,
  settings: fromSettings.settingReducer,
  revenues: fromRevenues.revenueReducer,
  openInvoices: fromOpenInvoices.openInvoiceReducer
};

export const selectInvoicingState = createFeatureSelector<InvoicingState>('invoicing');
