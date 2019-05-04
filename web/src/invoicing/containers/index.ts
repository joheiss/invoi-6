import {ConfirmationsComponent} from './confirmations/confirmations.component';
import {ContractsComponent} from './contracts/contracts.component';
import {InvoicesComponent} from './invoices/invoices.component';
import {InvoicingComponent} from './invoicing/invoicing.component';
import {ReceiversComponent} from './receivers/receivers.component';
import {ReceiverDetailsComponent} from './receiver-details/receiver-details.component';
import {ContractDetailsComponent} from './contract-details/contract-details.component';
import {InvoiceDetailsComponent} from './invoice-details/invoice-details.component';
import {DocumentLinkListComponent} from './document-link-list/document-link-list.component';
import {OverviewComponent} from './overview/overview.component';


export const containers: any[] = [
  OverviewComponent,
  InvoicingComponent,
  ConfirmationsComponent,
  ContractsComponent,
  ContractDetailsComponent,
  InvoicesComponent,
  InvoiceDetailsComponent,
  ReceiversComponent,
  ReceiverDetailsComponent,
  DocumentLinkListComponent
];

export * from './invoicing/invoicing.component';
export * from './confirmations/confirmations.component';
export * from './contracts/contracts.component';
export * from './contract-details/contract-details.component';
export * from './invoices/invoices.component';
export * from './invoice-details/invoice-details.component';
export * from './receivers/receivers.component';
export * from './receiver-details/receiver-details.component';
export * from '../../admin/containers/settings/settings.component';
export * from './document-link-list/document-link-list.component';
export * from '../../admin/containers/country-list/country-list.component';
export * from '../../admin/containers/vat-list/vat-list.component';
export * from '../../admin/containers/vat-details-dialog/vat-details-dialog.component';
export * from '../../admin/containers/country-details-dialog/country-details-dialog.component';
export * from './overview/overview.component';
