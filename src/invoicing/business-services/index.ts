import {ReceiversBusinessService} from './receivers-business.service';
import {ContractsBusinessService} from './contracts-business.service';
import {InvoicesBusinessService} from './invoices-business.service';
import {DocumentLinksBusinessService} from './document-links-business.service';
import {RevenuesBusinessService} from './revenues-business.service';

export const businessServices: any[] = [
  ReceiversBusinessService,
  ContractsBusinessService,
  InvoicesBusinessService,
  DocumentLinksBusinessService,
  RevenuesBusinessService
];

export * from './receivers-business.service';
export * from './contracts-business.service';
export * from './invoices-business.service';
export * from './document-links-business.service';
export *  from './revenues-business.service';
