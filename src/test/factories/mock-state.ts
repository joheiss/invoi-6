import {mockAuthState} from './mock-auth-state.factory';
import {mockUsersState} from './mock-users-state.factory';
import * as fromNumberRanges from '../../invoicing/store/reducers/number-ranges.reducer';
import * as fromReceivers from '../../invoicing/store/reducers/receivers.reducer';
import * as fromContracts from '../../invoicing/store/reducers/contracts.reducer';
import * as fromInvoices from '../../invoicing/store/reducers/invoices.reducer';
import * as fromDocumentLinks from '../../invoicing/store/reducers/document-links.reducer';
import * as fromSettings from '../../invoicing/store/reducers/settings.reducer';
import {mockNumberRangesState} from './mock-number-ranges.factory';
import {mockReceiversState} from './mock-receivers.factory';
import {mockContractsState} from './mock-contracts.factory';
import {mockInvoicesState} from './mock-invoices.factory';
import {mockDocumentLinksState} from './mock-document-links.factory';
import {mockSettingsState} from './mock-settings.factory';


export const mockState = (): any => {
  return {
    routerReducer: {
      state: {
        url: '/users',
        params: {},
        queryParams: {}
      }
    },
    uiReducer: {
      isSpinning: true
    },
    auth: mockAuthState(),
    users: mockUsersState(),
    invoicing: {
      numberRanges: mockNumberRangesState(),
      receivers: mockReceiversState(),
      contracts: mockContractsState(),
      invoices: mockInvoicesState(),
      documentLinks: mockDocumentLinksState(),
      settings: mockSettingsState()
    }
  };
};
