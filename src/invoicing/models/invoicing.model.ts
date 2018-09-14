import {Receiver} from './receiver.model';
import {Contract} from './contract.model';
import {Invoice} from './invoice.model';

export enum PaymentMethod {
  BankTransfer,
  DirectDebit,
  CreditCard,
  Check,
  Cash
}

export enum BillingMethod {
  Invoice,
  CreditNote
}

export abstract class Summary {
  object: any;
}

export interface ReceiverSummary extends Summary {
  object: Receiver;
  deletable: boolean;
  activeContractsCount: number;
  expiredContractsCount: number;
  lastContractId: string;
  dueInvoicesCount: number;
  openInvoicesCount: number;
  lastInvoiceId: string;
}

export type ReceiverSummaries = {[id: string]: ReceiverSummary };

export interface ContractSummary extends Summary {
  object: Contract;
  receiverName: string;
  changeable: boolean;
  revenue: number;
  lastInvoiceId: string;
}

export type ContractSummaries = {[id: string]: ContractSummary };

export interface InvoiceSummary extends Summary {
  object: Invoice;
  receiverName: string;
  changeable: boolean;
}

export type InvoiceSummaries = {[id: string]: InvoiceSummary };

export interface CreditRequestSummary extends InvoiceSummary {}
export type CreditRequestSummaries = {[id: string]: CreditRequestSummary };
