import {BillingMethod, PaymentMethod} from '../../invoicing/models/invoicing.model';
import {ContractData} from '../../invoicing/models/contract.model';
import {DateUtilities} from '../../shared/utilities/date-utilities';

export const mockSingleContract = (): ContractData => {
  const today = new Date();
  const year = today.getFullYear();
  const id = 4901;
  const description = `Testvertrag ${year.toString()} - Rechnung`;
  const customerId = '1901';
  const billingMethod = BillingMethod.Invoice;
  const cashDiscount = true;
  const issuedAt = DateUtilities.getDateOnly(new Date(year, 0, 1));
  const startDate = DateUtilities.getDateOnly(new Date(year, 0, 1));
  const endDate = DateUtilities.getEndDate(new Date(year, 11, 31));
  return getBaseContract(id, issuedAt, description, customerId, startDate, endDate, cashDiscount, billingMethod);
};

export const mockAllContracts = (): ContractData[] => {

  const today = new Date();
  const currentYear = today.getFullYear();
  const allContracts: ContractData[] = [];

  let id = 4900;
  let description;
  let customerId;
  let billingMethod;
  let cashDiscount;

  // --- invoices for the past 4 years
  for (let i = 4; i >= 0; i--) {
    const issuedAt = DateUtilities.getDateOnly(new Date(currentYear - i, 0, 1));
    const startDate = DateUtilities.getDateOnly(new Date(currentYear - i, 0, 1));
    const endDate = DateUtilities.getEndDate(new Date(currentYear - i, 11, 31));
    for (let j = 0; j < 2; j++) {
      id++;
      if (j === 0) {
        description = `Testvertrag ${(currentYear - i).toString()} - Rechnung`;
        customerId = '1901';
        billingMethod = BillingMethod.Invoice;
        cashDiscount = true;
      } else {
        description = `Testvertrag ${(currentYear - i).toString()} - Gutschrift`;
        customerId = '1902';
        billingMethod = BillingMethod.CreditNote;
        cashDiscount = false;
      }
      const base = getBaseContract(id, issuedAt, description, customerId, startDate, endDate, cashDiscount, billingMethod);
      const contract = {...base} as ContractData;
      if (j === 1) {
        contract.items = contract.items.filter(p => p.id === 1);
      }
      allContracts.push(contract);
    }
  }
  return allContracts.sort((a, b) => b.id.localeCompare(a.id));
};

export const mockContractIds = (): string[] => {
  const allContracts = mockAllContracts();
  return allContracts.map(c => c.id);
};

export const mockContractsEntity = (): any => {
  const allContracts = mockAllContracts();
  const entity = {};
  allContracts.map(c => entity[c.id] = c);
  return entity;
};

const getBaseContract = (id: number, issuedAt: Date, description: string, customerId: string,
                         startDate: Date, endDate: Date, cashDiscount: boolean, billingMethod: BillingMethod): ContractData => {
  return {
    id: id.toString(),
    issuedAt: issuedAt,
    objectType: 'contracts',
    organization: 'THQ',
    description: description,
    customerId: customerId,
    startDate: startDate,
    endDate: endDate,
    paymentTerms: cashDiscount ? '30 Tage: 3 % Skonto; 60 Tage: netto' : '30 Tage: netto',
    paymentMethod: PaymentMethod.BankTransfer,
    billingMethod: billingMethod,
    cashDiscountDays: cashDiscount ? 30 : 0,
    cashDiscountPercentage: cashDiscount ? 3.0 : 0.0,
    dueDays: cashDiscount ? 60 : 30,
    currency: 'EUR',
    budget: 12.00,
    invoiceText: 'Dieser Text wird auf der Rechnung gedruckt.',
    internalText: 'Dieser Text ist für interne Zwecke.',
    items: [
      {id: 1, description: 'Arbeitstage im Projekt T/E/S/T', pricePerUnit: 10.00, priceUnit: 'Tage', cashDiscountAllowed: true},
      {id: 2, description: 'Reisezeit im Projekt T/E/S/T', pricePerUnit: 5.00, priceUnit: 'Std.', cashDiscountAllowed: true},
      {id: 3, description: 'km-Pauschale', pricePerUnit: 1.00, priceUnit: 'km', cashDiscountAllowed: false},
      {id: 4, description: 'Übernachtungspauschale', pricePerUnit: 3.00, priceUnit: 'Übernachtungen', cashDiscountAllowed: false}
    ]
  };
};

