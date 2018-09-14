import {ReceiversService} from './receivers.service';
import {ContractsService} from './contracts.service';
import {InvoicesService} from './invoices.service';
import {SettingsService} from './settings.service';
import {NumberRangesService} from './numberRanges.service';
import {DocumentLinksService} from './document-links.service';
import {RevenuesService} from './revenues.service';
import {OpenInvoicesService} from './open-invoices.service';

export const services: any[] = [
  NumberRangesService,
  ReceiversService,
  ContractsService,
  InvoicesService,
  SettingsService,
  RevenuesService,
  OpenInvoicesService,
  DocumentLinksService
];

export * from './numberRanges.service';
export * from './receivers.service';
export * from './contracts.service';
export * from './invoices.service';
export * from './settings.service';
export * from './document-links.service';
export * from './revenues.service';
export * from './open-invoices.service';

