import {UserInfo} from 'firebase';
import {UserProfileData} from '../auth/models/user';
import {authAdapter, AuthState} from '../auth/store/reducers/auth.reducer';
import {userAdapter, UserState} from '../auth/store/reducers/users.reducer';
import {IdState} from '../auth/store/reducers';
import {Contract, ContractData} from '../invoicing/models/contract.model';
import {BillingMethod, PaymentMethod} from '../invoicing/models/invoicing.model';
import {TransactionItemData} from '../invoicing/models/transaction';
import {DocumentLink, DocumentLinkType} from '../invoicing/models/document-link';
import {Invoice, InvoiceData, InvoiceStatus} from '../invoicing/models/invoice.model';

export const generateAuth = (): UserInfo => {
  return {
    displayName: 'Teddy Tester',
    email: 'tester@test.de',
    phoneNumber: '+49 123 456789',
    photoURL: 'https://some-image.url',
    providerId: '',
    uid: 'tester@test.de_1234567890'
  };
};

export const generateUserProfile = (): UserProfileData => {
  const userInfo = generateAuth();
  return {
    displayName: userInfo.displayName,
    email: userInfo.email,
    phoneNumber: userInfo.phoneNumber,
    imageUrl: userInfo.photoURL,
    uid: userInfo.uid,
    roles: ['sales-user'],
    organization: 'GHQ',
    isLocked: false
  };
};

export const generateMoreUserProfiles = (count: number = 5): UserProfileData[] => {
  const users: UserProfileData[] = [] as UserProfileData[];
  for (let i = 0; i < count; i++) {
    const user = generateUserProfile();
    user.displayName = `${user.displayName} #${i.toString()}`;
    user.email = `${user.email} ${i.toString()}`;
    user.phoneNumber = `${user.phoneNumber} ${i.toString()}`;
    user.uid = `${user.uid}${i.toString()}`;
    users.push(user);
  }
  return users;
};

export const generateNewUser = (): UserProfileData => {
  const userData = generateUserProfile();
  userData.displayName = 'New User';
  userData.email = 'newuser@test.de';
  userData.phoneNumber = `${userData.phoneNumber}111`;
  userData.uid = undefined;
  return userData;
};

export const generateAuthState = (): AuthState => {
  const authUser = generateUserProfile();
  const authState = authAdapter.getInitialState();
  return authAdapter.addOne(authUser, {...authState, loading: false, loaded: true});
};

export const generateUsersStateWithOnlyAuthUser = (): UserState => {
  const authUser = generateUserProfile();
  const userState = userAdapter.getInitialState();
  return userAdapter.addOne(authUser, {...userState, loading: false, loaded: true});
};

export const generateUsersState = (): UserState => {
  const authUser = generateUserProfile();
  const userState = userAdapter.getInitialState();
  userAdapter.addOne(authUser, {...userState, loading: false, loaded: true});
  const moreUsers = generateMoreUserProfiles();
  return userAdapter.addMany(moreUsers, {...userState, loading: false, loaded: true});
};

export const generateIdStateWithOnlyAuthUser = (): IdState => {
  return {
    auth: generateAuthState(),
    users: generateUsersStateWithOnlyAuthUser()
  };
};

export const generateIdState = (): IdState => {
  return {
    auth: generateAuthState(),
    users: generateUsersState()
  };
};

export const generateContractData = (validity: number = 0): ContractData => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const contractYear = currentYear + validity;
  const issuedAt = new Date(contractYear - 1, 10, 30);
  const startDate = new Date(contractYear, 0, 1);
  const endDate = new Date(contractYear, 11, 31);
  return {
    id: (4901 + validity).toString(),
    issuedAt: issuedAt,
    objectType: 'contracts',
    organization: 'THQ',
    description: 'Aktueller Testvertrag',
    customerId: '1901',
    startDate: startDate,
    endDate: endDate,
    paymentTerms: '30 Tage: 3 % Skonto; 60 Tage: netto',
    paymentMethod: PaymentMethod.BankTransfer,
    billingMethod: BillingMethod.Invoice,
    cashDiscountDays: 30,
    cashDiscountPercentage: 3.0,
    dueDays: 60,
    currency: 'EUR',
    budget: 120000.00,
    invoiceText: 'Dieser Text wird auf der Rechnung gedruckt.',
    internalText: 'Dieser Text ist für interne Zwecke.',
    items: [
      {id: 1, description: 'Arbeitstage im Projekt T/E/S/T', pricePerUnit: 1000.00, priceUnit: 'Tage', cashDiscountAllowed: true},
      {id: 2, description: 'Reisezeit im Projekt T/E/S/T', pricePerUnit: 100.00, priceUnit: 'Std.', cashDiscountAllowed: true},
      {id: 3, description: 'km-Pauschale', pricePerUnit: 1.00, priceUnit: 'km', cashDiscountAllowed: false},
      {id: 4, description: 'Übernachtungspauschale', pricePerUnit: 200.00, priceUnit: 'Übernachtungen', cashDiscountAllowed: false}
    ]
  };
};

export const generateContract = (validity: number = 0): Contract => {
  return Contract.createFromData(generateContractData(validity));
};

export const generateNewContractData = (): ContractData => {
  const contractData = generateContractData();
  const today = new Date();
  const currentYear = today.getFullYear();
  const contractYear = currentYear + 1;
  const issuedAt = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDate = new Date(contractYear, 0, 1);
  const endDate = new Date(contractYear, 11, 31);
  return {
    ...contractData,
    id: '4904',
    issuedAt: issuedAt,
    startDate: startDate,
    endDate: endDate
  };
};

export const generateNewContract = (): Contract => {
  return Contract.createFromData(generateNewContractData());
};

export const generateMoreContractData = (): ContractData[] => {
  const more: ContractData[] = [];
  for (let i = -1; i < 2; i++) {
    more.push(generateContractData(i));
  }
  return more;
};

export const generateMoreContracts = (): Contract[] => {
  return generateMoreContractData().map(c => Contract.createFromData(c));
};

export const generateInvoiceData = (period: number = 0): InvoiceData => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const invoiceMonth = currentMonth + period;
  const issuedAt = new Date(currentYear, currentMonth, 5);
  return {
    id: (5901 + period).toString(),
    issuedAt: issuedAt,
    objectType: 'invoices',
    organization: 'THQ',
    status: InvoiceStatus.created,
    receiverId: '1901',
    contractId: '4901',
    paymentTerms: '30 Tage: 3 % Skonto; 60 Tage: netto',
    paymentMethod: PaymentMethod.BankTransfer,
    billingMethod: BillingMethod.Invoice,
    billingPeriod: 'Testperiode 1',
    cashDiscountDays: 30,
    cashDiscountPercentage: 3.0,
    dueInDays: 60,
    currency: 'EUR',
    vatPercentage: 19.0,
    invoiceText: 'Dieser Text wird auf der Rechnung gedruckt.',
    internalText: 'Dieser Text ist für interne Zwecke.',
    items: [
      {
        id: 1, contractItemId: 1, description: 'Arbeitstage im Projekt T/E/S/T', pricePerUnit: 1000.00,
        quantity: 10.0, quantityUnit: 'Tage', cashDiscountAllowed: true, vatPercentage: 19.0
      },
      {
        id: 2, contractItemId: 2, description: 'Reisezeit im Projekt T/E/S/T', pricePerUnit: 100.00,
        quantity: 20.0, quantityUnit: 'Std.', cashDiscountAllowed: true, vatPercentage: 19.0
      },
      {
        id: 3, contractItemId: 3, description: 'km-Pauschale', pricePerUnit: 1.00,
        quantity: 200.0, quantityUnit: 'km', cashDiscountAllowed: false, vatPercentage: 19.0
      },
      {
        id: 4, contractItemId: 4, description: 'Übernachtungspauschale', pricePerUnit: 200.00,
        quantity: 2.0, quantityUnit: 'Übernachtungen', cashDiscountAllowed: false, vatPercentage: 19.0
      }
    ]
  };
};

export const generateInvoice = (period: number = 0): Invoice => {
  return Invoice.createFromData(generateInvoiceData(period));
};

export const generateNewInvoiceData = (): InvoiceData => {
  const invoiceData = generateInvoiceData();
  const today = new Date();
  const issuedAt = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  invoiceData.organization = null;
  invoiceData.billingPeriod = null;
  invoiceData.internalText = null;
  delete invoiceData['id'];
  invoiceData.items = invoiceData.items.filter(item => item.id === 1);
  invoiceData.items[0].quantity = 0;
  return {
    ...invoiceData,
    issuedAt: issuedAt
  };
};

export const generateNewInvoice = (): Invoice => {
  return Invoice.createFromData(generateNewInvoiceData());
};

export const generateMoreInvoiceData = (count: number = 3): InvoiceData[] => {
  const more: InvoiceData[] = [];
  for (let i = 0; i < count; i++) {
    more.push(generateInvoiceData(i + 1));
  }
  return more;
};

export const generateMoreInvoices = (count: number = 3): Invoice[] => {
  return generateMoreInvoiceData(count).map(i => Invoice.createFromData(i));
};

export const generateDocumentLink = (owner: string): DocumentLink => {
  return {
    $id: '2OKzIpO58iM19IR7u2ve',
    name: 'Test Document',
    path: `docs/${owner}/test-document.txt`,
    type: DocumentLinkType.Other,
    attachToEmail: false,
    owner: owner
  };
};



