import {mockNumberRangesState} from './mock-number-ranges.factory';
import {mockReceiversState} from './mock-receivers.factory';
import {mockContractsState} from './mock-contracts.factory';
import {mockInvoicesState} from './mock-invoices.factory';
import {mockDocumentLinksState} from './mock-document-links.factory';
import {mockSettingsState} from './mock-settings.factory';
import {InvoicingState} from '../../invoicing/store';
import {mockRevenuesState} from './mock-revenues.factory';

export const mockInvoicingState = (): InvoicingState => {
  return {
    numberRanges: mockNumberRangesState(),
    receivers: mockReceiversState(),
    contracts: mockContractsState(),
    invoices: mockInvoicesState(),
    documentLinks: mockDocumentLinksState(),
    settings: mockSettingsState(),
    revenues: mockRevenuesState()
  };
};

