import {Action} from '@ngrx/store';
import {InvoiceData} from 'jovisco-domain';

// FIRESTORE
export const QUERY_INVOICES = '[Invoicing] Invoices query';
export const ADDED_INVOICE = '[Invoicing] Invoice added';
export const MODIFIED_INVOICE = '[Invoicing] Invoice modified';
export const REMOVED_INVOICE = '[Invoicing] Invoice removed';
export const UPDATE_INVOICE = '[Invoicing] Invoice update';
export const UPDATE_INVOICE_SUCCESS = '[Invoicing] Invoice update success';
export const UPDATE_INVOICE_FAIL = '[Invoicing] Invoice update fail';

export class QueryInvoices implements Action {
  readonly type = QUERY_INVOICES;
  constructor(public payload?: any) {}
}

export class AddedInvoice implements Action {
  readonly type = ADDED_INVOICE;
  constructor(public payload: InvoiceData) {}
}

export class ModifiedInvoice implements Action {
  readonly type = MODIFIED_INVOICE;
  constructor(public payload: InvoiceData) {}
}

export class RemovedInvoice implements Action {
  readonly type = REMOVED_INVOICE;
  constructor(public payload: InvoiceData) {}
}

export class UpdateInvoice implements Action {
  readonly type = UPDATE_INVOICE;
  constructor(public payload: InvoiceData) {}
}

export class UpdateInvoiceSuccess implements Action {
  readonly type = UPDATE_INVOICE_SUCCESS;
  constructor(public payload: InvoiceData) {}
}

export class UpdateInvoiceFail implements Action {
  readonly type = UPDATE_INVOICE_FAIL;
  constructor(public payload: any) {
  }
}

// CREATING
export const CREATE_INVOICE = '[Invoicing] Create Invoice';
export const CREATE_INVOICE_FAIL = '[Invoicing] Create Invoice Fail';
export const CREATE_INVOICE_SUCCESS = '[Invoicing] Create Invoice Success';

export class CreateInvoice implements Action {
  readonly type = CREATE_INVOICE;
  constructor(public payload: InvoiceData) {
  }
}

export class CreateInvoiceFail implements Action {
  readonly type = CREATE_INVOICE_FAIL;
  constructor(public payload: any) {
  }
}

export class CreateInvoiceSuccess implements Action {
  readonly type = CREATE_INVOICE_SUCCESS;
  constructor(public payload: InvoiceData) {
  }
}

// DELETING
export const DELETE_INVOICE = '[Invoicing] Delete Invoice';
export const DELETE_INVOICE_FAIL = '[Invoicing] Delete Invoice Fail';
export const DELETE_INVOICE_SUCCESS = '[Invoicing] Delete Invoice Success';

export class DeleteInvoice implements Action {
  readonly type = DELETE_INVOICE;
  constructor(public payload: InvoiceData) {
  }
}

export class DeleteInvoiceFail implements Action {
  readonly type = DELETE_INVOICE_FAIL;
  constructor(public payload: any) {
  }
}

export class DeleteInvoiceSuccess implements Action {
  readonly type = DELETE_INVOICE_SUCCESS;
  constructor(public payload: InvoiceData) {
  }
}

// COPYING
export const COPY_INVOICE = '[Invoicing] Copy Invoice';
export const COPY_INVOICE_FAIL = '[Invoicing] Copy Invoice Fail';
export const COPY_INVOICE_SUCCESS = '[Invoicing] Copy Invoice Success';

export class CopyInvoice implements Action {
  readonly type = COPY_INVOICE;
  constructor(public payload: InvoiceData) {
  }
}

export class CopyInvoiceFail implements Action {
  readonly type = COPY_INVOICE_FAIL;
  constructor(public payload: any) {
  }
}

export class CopyInvoiceSuccess implements Action {
  readonly type = COPY_INVOICE_SUCCESS;
  constructor(public payload: InvoiceData) {
  }
}

// NEW
export const NEW_INVOICE = '[Invoicing] New Invoice';
export const NEW_INVOICE_FAIL = '[Invoicing] New Invoice Fail';
export const NEW_INVOICE_SUCCESS = '[Invoicing] New Invoice Success';

export class NewInvoice implements Action {
  readonly type = NEW_INVOICE;
  constructor() {
  }
}

export class NewInvoiceFail implements Action {
  readonly type = NEW_INVOICE_FAIL;
  constructor(public payload: any) {
  }
}

export class NewInvoiceSuccess implements Action {
  readonly type = NEW_INVOICE_SUCCESS;
  constructor(public payload: InvoiceData) {
  }
}

// NEW QUICK
export const NEW_QUICK_INVOICE = '[Invoicing] New Quick Invoice';
export const NEW_QUICK_INVOICE_FAIL = '[Invoicing] New Quick Invoice Fail';
export const NEW_QUICK_INVOICE_SUCCESS = '[Invoicing] New Quick Invoice Success';

export class NewQuickInvoice implements Action {
  readonly type = NEW_QUICK_INVOICE;
  constructor() {
  }
}

export class NewQuickInvoiceFail implements Action {
  readonly type = NEW_QUICK_INVOICE_FAIL;
  constructor(public payload: any) {
  }
}

export class NewQuickInvoiceSuccess implements Action {
  readonly type = NEW_QUICK_INVOICE_SUCCESS;
  constructor(public payload: InvoiceData) {
  }
}

// SELECTING
export const SELECT_INVOICE = '[Invoicing] Select Invoice';
export const SELECT_INVOICE_FAIL = '[Invoicing] Select Invoice Fail';
export const SELECT_INVOICE_SUCCESS = '[Invoicing] Select Invoice Success';

export class SelectInvoice implements Action {
  readonly type = SELECT_INVOICE;
  constructor(public payload: InvoiceData) {
  }
}

export class SelectInvoiceFail implements Action {
  readonly type = SELECT_INVOICE_FAIL;
  constructor(public payload: any) {
  }
}

export class SelectInvoiceSuccess implements Action {
  readonly type = SELECT_INVOICE_SUCCESS;
  constructor(public payload: InvoiceData) {
  }
}

// CHANGING
export const CHANGE_INVOICE = '[Invoicing] Change Invoice';
export const CHANGE_INVOICE_FAIL = '[Invoicing] Change Invoice Fail';
export const CHANGE_INVOICE_SUCCESS = '[Invoicing] Change Invoice Success';

export class ChangeInvoice implements Action {
  readonly type = CHANGE_INVOICE;
  constructor(public payload: InvoiceData) {}
}

export class ChangeInvoiceFail implements Action {
  readonly type = CHANGE_INVOICE_FAIL;
  constructor(public payload: any) {
  }
}

export class ChangeInvoiceSuccess implements Action {
  readonly type = CHANGE_INVOICE_SUCCESS;
  constructor(public payload: InvoiceData) {
  }
}

// CREATING PDF
export const CREATE_INVOICE_PDF = '[Invoicing] Create Invoice PDF';
export const CREATE_INVOICE_PDF_FAIL = '[Invoicing] Create Invoice PDF Fail';
export const CREATE_INVOICE_PDF_SUCCESS = '[Invoicing] Create Invoice PDF Success';

export class CreateInvoicePdf implements Action {
  readonly type = CREATE_INVOICE_PDF;
  constructor(public payload: InvoiceData) {
  }
}

export class CreateInvoicePdfFail implements Action {
  readonly type = CREATE_INVOICE_PDF_FAIL;
  constructor(public payload: any) {
  }
}

export class CreateInvoicePdfSuccess implements Action {
  readonly type = CREATE_INVOICE_PDF_SUCCESS;
  constructor(public payload: InvoiceData) {
  }
}

// CREATING PDF
export const SEND_INVOICE_EMAIL = '[Invoicing] Send Invoice Email';
export const SEND_INVOICE_EMAIL_FAIL = '[Invoicing] Send Invoice Email Fail';
export const SEND_INVOICE_EMAIL_SUCCESS = '[Invoicing] Send Invoice Email Success';

export class SendInvoiceEmail implements Action {
  readonly type = SEND_INVOICE_EMAIL;
  constructor(public payload: InvoiceData) {
  }
}

export class SendInvoiceEmailFail implements Action {
  readonly type = SEND_INVOICE_EMAIL_FAIL;
  constructor(public payload: any) {
  }
}

export class SendInvoiceEmailSuccess implements Action {
  readonly type = SEND_INVOICE_EMAIL_SUCCESS;
  constructor(public payload: InvoiceData) {
  }
}

export type InvoiceAction =
  CreateInvoice | CreateInvoiceFail | CreateInvoiceSuccess |
  UpdateInvoice | UpdateInvoiceFail | UpdateInvoiceSuccess |
  DeleteInvoice | DeleteInvoiceFail | DeleteInvoiceSuccess |
  CopyInvoice | CopyInvoiceFail | CopyInvoiceSuccess |
  NewInvoice | NewInvoiceFail | NewInvoiceSuccess |
  NewQuickInvoice | NewQuickInvoiceFail | NewQuickInvoiceSuccess |
  SelectInvoice | SelectInvoiceFail | SelectInvoiceSuccess |
  ChangeInvoice | ChangeInvoiceFail | ChangeInvoiceSuccess |
  CreateInvoicePdf | CreateInvoicePdfFail | CreateInvoicePdfSuccess |
  SendInvoiceEmail | SendInvoiceEmailFail | SendInvoiceEmailSuccess |
  QueryInvoices | AddedInvoice | ModifiedInvoice | RemovedInvoice;

