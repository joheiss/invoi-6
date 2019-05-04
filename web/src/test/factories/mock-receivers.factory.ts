import {receiverAdapter, ReceiverState} from '../../invoicing/store/reducers/receivers.reducer';
import {MasterdataStatus, ReceiverData, ReceiverFactory, ReceiversEntity, ReceiverSummary, ReceiverSummaryFactory} from 'jovisco-domain';
import {mockContractsEntity} from './mock-contracts.factory';
import {mockInvoicesEntity} from './mock-invoices.factory';

export const mockReceiversState = (): ReceiverState => {
  const state = receiverAdapter.getInitialState();
  return receiverAdapter.addMany(mockAllReceivers(), {
    ...state,
    loading: false,
    loaded: true,
    current: { isDirty: false, receiver: mockSingleReceiver() },
    error: undefined});
};

export const mockSingleReceiver = (): ReceiverData => {
  return getBaseReceiver('1901', 'Test AG', 'officium@test-ag.de');
};

export const mockAllReceivers = (): ReceiverData[] => {
  return [
    getBaseReceiver('1901', 'Test AG', 'officium@test-ag.de'),
    getBaseReceiver('1902', 'Test GmbH', 'buero@test-gmbh.de')
  ];
};

export const mockReceiverIds = (): string[] => {
  return mockAllReceivers().map(r => r.id);
};

export const mockReceiversEntity = (): ReceiversEntity => {
  const allReceivers = mockAllReceivers();
  const entity = {} as ReceiversEntity;
  allReceivers.map(r => entity[r.id] = r);
  return entity;
};

export const mockReceiverSummary = (): ReceiverSummary => {
  const receiver = ReceiverFactory.fromData(mockSingleReceiver());
  const contractsEntity = mockContractsEntity();
  const invoicesEntity = mockInvoicesEntity();
  return ReceiverSummaryFactory.fromReceiver(receiver)
    .setContractInfos(contractsEntity)
    .setInvoiceInfos(invoicesEntity);
};

const getBaseReceiver = (id: string, name: string, email: string): ReceiverData => {
  return {
    id: id,
    objectType: 'receivers',
    organization: 'THQ',
    name: name,
    nameAdd: null,
    logoUrl: null,
    status: MasterdataStatus.active,
    address: {
      country: 'DE',
      postalCode: '77777',
      city: 'Testlingen',
      street: 'Testgasse 1',
      email: email,
      phone: '+49 777 12345678',
      fax: '+49 777 12345678',
      webSite: null,
    }
  };
};
