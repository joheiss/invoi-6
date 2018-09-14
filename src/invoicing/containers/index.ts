import {ConfirmationsComponent} from './confirmations/confirmations.component';
import {ContractsComponent} from './contracts/contracts.component';
import {InvoicesComponent} from './invoices/invoices.component';
import {InvoicingComponent} from './invoicing/invoicing.component';
import {ReceiversComponent} from './receivers/receivers.component';
import {SettingsComponent} from './settings/settings.component';
import {ReceiverDetailsComponent} from './receiver-details/receiver-details.component';
import {ContractDetailsComponent} from './contract-details/contract-details.component';
import {InvoiceDetailsComponent} from './invoice-details/invoice-details.component';
import {DocumentLinkListComponent} from './document-link-list/document-link-list.component';
import {CountryListComponent} from './country-list/country-list.component';
import {VatListComponent} from './vat-list/vat-list.component';
import {VatDetailsDialogComponent} from './vat-details-dialog/vat-details-dialog.component';
import {CountryDetailsDialogComponent} from './country-details-dialog/country-details-dialog.component';
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
  SettingsComponent,
  CountryListComponent,
  CountryDetailsDialogComponent,
  DocumentLinkListComponent,
  VatListComponent,
  VatDetailsDialogComponent
];

export * from './invoicing/invoicing.component';
export * from './confirmations/confirmations.component';
export * from './contracts/contracts.component';
export * from './contract-details/contract-details.component';
export * from './invoices/invoices.component';
export * from './invoice-details/invoice-details.component';
export * from './receivers/receivers.component';
export * from './receiver-details/receiver-details.component';
export * from './settings/settings.component';
export * from './document-link-list/document-link-list.component';
export * from './country-list/country-list.component';
export * from './vat-list/vat-list.component';
export * from './vat-details-dialog/vat-details-dialog.component';
export * from './country-details-dialog/country-details-dialog.component';
export * from './overview/overview.component';
