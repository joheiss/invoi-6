export interface OpenInvoiceData {
  id: string;
  issuedAt: Date;
  billingPeriod: string;
  receiverId: string;
  receiverName: string;
  netValue: number;
  paymentAmount: number;
  dueDate: Date;
}

