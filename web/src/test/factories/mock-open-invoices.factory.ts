import {mockAllInvoices, mockSingleInvoice} from './mock-invoices.factory';
import {mockAllReceivers, mockSingleReceiver} from './mock-receivers.factory';
import {InvoiceFactory, OpenInvoiceData} from 'jovisco-domain';

export const mockSingleOpenInvoice = (): OpenInvoiceData => {
  const invoice = InvoiceFactory.fromData(mockSingleInvoice());
  const receiver = mockSingleReceiver();
  return {
    id: invoice.header.id,
    issuedAt: invoice.header.issuedAt,
    billingPeriod: invoice.header.billingPeriod,
    receiverId: invoice.header.receiverId,
    receiverName: receiver.name,
    netValue: invoice.netValue,
    paymentAmount: invoice.paymentAmount,
    dueDate: invoice.dueDate
  } as OpenInvoiceData;
};

export const mockAllOpenInvoices = (): OpenInvoiceData[] => {

  const receivers = mockAllReceivers();
  const invoices = InvoiceFactory.fromDataArray(mockAllInvoices()).slice(0, 5);
  return invoices.map(i => {
    const receiver = receivers.find(r => r.id === i.header.receiverId);
    return {
      id: i.header.id,
      issuedAt: i.header.issuedAt,
      billingPeriod: i.header.billingPeriod,
      receiverId: i.header.receiverId,
      receiverName: receiver.name,
      netValue: i.netValue,
      paymentAmount: i.paymentAmount,
      dueDate: i.dueDate
    };
  });
};

