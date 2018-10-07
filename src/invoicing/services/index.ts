import {ReceiversService} from './receivers.service';
import {ContractsService} from './contracts.service';
import {InvoicesService} from './invoices.service';
import {SettingsService} from './settings.service';
import {NumberRangesService} from './numberRanges.service';
import {DocumentLinksService} from './document-links.service';

export const services: any[] = [
  NumberRangesService,
  ReceiversService,
  ContractsService,
  InvoicesService,
  SettingsService,
  DocumentLinksService
];

export * from './numberRanges.service';
export * from './receivers.service';
export * from './contracts.service';
export * from './invoices.service';
export * from './settings.service';
export * from './document-links.service';

