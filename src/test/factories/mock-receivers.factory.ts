import {ReceiverData, ReceiverStatus} from '../../invoicing/models/receiver.model';

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

export const mockReceiverEntity = (): any => {
  const allReceivers = mockAllReceivers();
  const entity = {};
  allReceivers.map(r => entity[r.id] = r);
  return entity;
};

const getBaseReceiver = (id: string, name: string, email: string): ReceiverData => {
  return {
    id: id,
    objectType: 'receivers',
    organization: 'THQ',
    name: name,
    nameAdd: null,
    logoUrl: null,
    status: ReceiverStatus.active,
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