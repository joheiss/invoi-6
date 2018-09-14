import {NumberRangesGuard} from './number-ranges.guard';
import {ReceiversGuard} from './receivers.guard';
import {ContractsGuard} from './contracts.guard';
import {ReceiverExistsGuard} from './receiver-exists.guard';
import {ContractExistsGuard} from './contract-exists.guard';
import {InvoicesGuard} from './invoices.guard';
import {InvoiceExistsGuard} from './invoice-exists.guard';
import {SettingsGuard} from './settings.guard';
import {DocumentLinksGuard} from './document-links.guard';
import {RevenuesGuard} from './revenues.guard';
import {OpenInvoicesGuard} from './open-invoices.guard';

export const guards: any[] = [
  NumberRangesGuard,
  ReceiversGuard,
  ReceiverExistsGuard,
  ContractsGuard,
  ContractExistsGuard,
  InvoicesGuard,
  InvoiceExistsGuard,
  DocumentLinksGuard,
  SettingsGuard,
  RevenuesGuard,
  OpenInvoicesGuard
];

export * from './number-ranges.guard';
export * from './receivers.guard';
export * from './contracts.guard';
export * from './receiver-exists.guard';
export * from './contract-exists.guard';
export * from './invoices.guard';
export * from './invoice-exists.guard';
export * from './settings.guard';
export * from './document-links.guard';
export * from './revenues.guard';
export * from './open-invoices.guard';
