import {invoiceAdapter, InvoiceState} from '../../invoicing/store/reducers/invoices.reducer';
import {
  BillingMethod,
  DateUtility,
  InvoiceData,
  InvoiceFactory,
  InvoicesEntity,
  InvoiceStatus,
  InvoiceSummary,
  InvoiceSummaryFactory,
  PaymentMethod
} from 'jovisco-domain';
import {mockReceiversEntity} from './mock-receivers.factory';

export const mockInvoicesState = (): InvoiceState => {
  const state = invoiceAdapter.getInitialState();
  return invoiceAdapter.addMany(mockAllInvoices(), {
    ...state,
    loading: false,
    loaded: true,
    current: { isDirty: false, invoice: mockSingleInvoice() }
  });
};

export const mockSingleInvoice = (): InvoiceData => {
  const today = new Date();
  const id = 5901;
  const receiverId = '1901';
  const contractId = '4909';
  const billingPeriod = `${today.getFullYear().toString()} - ${(today.getMonth() + 1).toString()}`;
  const billingMethod = BillingMethod.Invoice;
  const cashDiscount = true;
  const issuedAt = DateUtility.getStartDate(new Date());
  return getBaseInvoice(id, issuedAt, receiverId, contractId, billingPeriod, cashDiscount, billingMethod);
};

export const mockAllInvoices = (): InvoiceData[] => {

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const allInvoices: InvoiceData[] = [];

  let issuedAtYear = currentYear, issuedAtMonth = currentMonth;
  let issuedAt: Date;
  let id = 5900;
  let receiverId, contractId, billingMethod, cashDiscount;
  // invoices and credit requests
  for (let h = 0; h < 2; h++) {
    if (h === 0) {
      receiverId = '1901';
      billingMethod = BillingMethod.Invoice;
      cashDiscount = true;
    } else {
      receiverId = '1902';
      billingMethod = BillingMethod.CreditNote;
      cashDiscount = false;
    }
    // --- invoices for the past 4 years
    for (let i = 4; i >= 0; i--) {
      issuedAtYear = currentYear - i;
      if (h === 0) {
        contractId = 4900 + (i * 2) + 1;
      } else {
        contractId = 4900 + (i * 2) + 2;
      }
      for (let j = 0; j < 12; j++) {
        issuedAtMonth = j;
        issuedAt = new Date(issuedAtYear, issuedAtMonth, 15);
        const billingPeriod = `${today.getFullYear().toString()} - ${(today.getMonth() + 1).toString()}`;
        if (issuedAt < today) {
          id++;
          const invoice = getBaseInvoice(id, issuedAt, receiverId, contractId.toString(), billingPeriod, cashDiscount, billingMethod);
          allInvoices.push(invoice);
        }
      }
    }
  }
  return allInvoices.sort((a: any, b: any) => {
    const result = b.issuedAt.getTime() - a.issuedAt.getTime();
    return result ? result : a.id.localeCompare(b.id);
  });
};

export const mockInvoiceIds = (): string[] => {
  const allContracts = mockAllInvoices();
  return allContracts.map(i => i.id).sort((a, b) => b.localeCompare(a));
};

export const mockInvoicesEntity = (): InvoicesEntity => {
  const allInvoices = mockAllInvoices();
  const entity = {} as InvoicesEntity;
  allInvoices.map(i => entity[i.id] = i).sort((a: any, b: any) => b.issuedAt - a.issuedAt);
  return entity;
};

export const mockInvoiceSummary = (): InvoiceSummary => {
  const invoice = InvoiceFactory.fromData(mockSingleInvoice());
  const receiversEntity = mockReceiversEntity();
  return InvoiceSummaryFactory.fromInvoice(invoice).setReceiverInfos(receiversEntity);
};

const getBaseInvoice = (id: number, issuedAt: Date, receiverId: string, contractId: string,
                        billingPeriod: string, cashDiscount: boolean, billingMethod: BillingMethod): InvoiceData => {
  return {
    id: id.toString(),
    issuedAt: issuedAt,
    objectType: 'invoices',
    organization: 'THQ',
    isDeletable: true,
    status: InvoiceStatus.created,
    receiverId: receiverId,
    contractId: contractId,
    paymentTerms: cashDiscount ? '30 Tage: 3 % Skonto; 60 Tage: netto' : '30 Tage: netto',
    paymentMethod: PaymentMethod.BankTransfer,
    billingMethod: billingMethod,
    billingPeriod: billingPeriod,
    cashDiscountDays: cashDiscount ? 30 : 0,
    cashDiscountPercentage: cashDiscount ? 3.0 : 0.0,
    dueInDays: cashDiscount ? 60 : 30,
    currency: 'EUR',
    vatPercentage: 19.0,
    invoiceText: 'Dieser Text wird auf der Rechnung gedruckt.',
    internalText: 'Dieser Text ist für interne Zwecke.',
    items: [
      {
        id: 1, contractItemId: 1, description: 'Arbeitstage im Projekt T/E/S/T', pricePerUnit: 1.00,
        quantity: 1.0, quantityUnit: 'Tage', cashDiscountAllowed: true, vatPercentage: 19.0
      },
    ]
  };
};

