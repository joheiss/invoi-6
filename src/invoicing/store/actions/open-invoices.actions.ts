import {Action} from '@ngrx/store';
import {OpenInvoiceData} from '../../models/open-invoice.model';

// FIRESTORE
export const QUERY_OPEN_INVOICES = '[Invoicing] OpenInvoices query';
export const ADDED_OPEN_INVOICE = '[Invoicing] OpenInvoice added';
export const MODIFIED_OPEN_INVOICE = '[Invoicing] OpenInvoice modified';
export const REMOVED_OPEN_INVOICE = '[Invoicing] OpenInvoice removed';

export class QueryOpenInvoices implements Action {
  readonly type = QUERY_OPEN_INVOICES;
  constructor() {}
}

export class AddedOpenInvoice implements Action {
  readonly type = ADDED_OPEN_INVOICE;
  constructor(public payload: OpenInvoiceData) {}
}

export class ModifiedOpenInvoice implements Action {
  readonly type = MODIFIED_OPEN_INVOICE;
  constructor(public payload: OpenInvoiceData) {}
}

export class RemovedOpenInvoice implements Action {
  readonly type = REMOVED_OPEN_INVOICE;
  constructor(public payload: OpenInvoiceData) {}
}

export type OpenInvoiceAction =
  QueryOpenInvoices | AddedOpenInvoice | ModifiedOpenInvoice | RemovedOpenInvoice;


