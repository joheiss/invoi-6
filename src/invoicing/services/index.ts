import {ReceiversService} from './receivers.service';
import {ContractsService} from './contracts.service';
import {InvoicesService} from './invoices.service';
import {SettingsService} from '../../admin/services/settings.service';
import {NumberRangesService} from './numberRanges.service';
import {DocumentLinksService} from './document-links.service';
import {RevenuesService} from './revenues.service';

export const services: any[] = [
  NumberRangesService,
  ReceiversService,
  ContractsService,
  InvoicesService,
  SettingsService,
  DocumentLinksService,
  RevenuesService
];

export * from './numberRanges.service';
export * from './receivers.service';
export * from './contracts.service';
export * from './invoices.service';
export * from '../../admin/services/settings.service';
export * from './document-links.service';
export * from './revenues.service';

