import {Transaction, TransactionHeaderData, TransactionItem, TransactionItemData} from './transaction';
import {BillingMethod, PaymentMethod} from './invoicing.model';

export interface ContractHeaderData extends TransactionHeaderData {
  description?: string;
  customerId?: string;
  startDate?: Date;
  endDate?: Date;
  paymentTerms?: string;
  paymentMethod?: PaymentMethod;
  billingMethod?: BillingMethod;
  cashDiscountDays?: number;
  cashDiscountPercentage?: number;
  dueDays?: number;
  currency?: string;
  budget?: number;
  invoiceText?: string;
  internalText?: string;
}

export interface ContractItemData extends TransactionItemData {
  description?: string;
  pricePerUnit?: number;
  priceUnit?: string;
  cashDiscountAllowed?: boolean;
}

export interface ContractData extends ContractHeaderData {
  items?: ContractItemData[];
}

export class Contract extends Transaction {
  public static createFromData(data: ContractData) {
    if (data) {
      const header = Contract.extractHeaderFromData(data);
      const items = Contract.createItemsFromData(data.items);
      return new Contract(header, items);
    }
    return undefined;
  }

  private static createItemsFromData(items: ContractItemData[]): ContractItem[] {
    return items ? items.map(item => ContractItem.createFromData(item)) : [];
  }

  private static extractHeaderFromData(data: ContractData): ContractHeaderData {
    const {items: removed1, ...header} = data;
    header.issuedAt = new Date(data.issuedAt);
    header.startDate = new Date(data.startDate);
    header.endDate = new Date(data.endDate);
    return header;
  }

  constructor(public header?: ContractHeaderData,
              public items?: ContractItem[]) {
    super();
  }


  get data(): ContractData {
    return {
      ...this.header,
      items: this.getItemsData()
    };
  }

  public buildNewItemFromTemplate(): ContractItem {
    // get next item number
    const id = this.getNextItemId();
    // build item template
    return {id} as ContractItem;
  }

  public isActive(): boolean {
    const now = new Date();
    const start = new Date(this.header.startDate);
    const end = new Date(this.header.endDate);
    return start <= now && end >= now;
  }

  public isFuture(): boolean {
    const now = new Date();
    const start = new Date(this.header.startDate);
    const end = new Date(this.header.endDate);
    return start > now && end > now;
  }

  public isInvoiceable(): boolean {
    const now = new Date();
    const start = new Date(this.header.startDate);
    const end = new Date(this.header.endDate);
    end.setMonth(end.getMonth() + 1);
    return start <= now && end >= now;
  }
}

export class ContractItem extends TransactionItem {
  private _description: string;
  private _pricePerUnit: number;
  private _priceUnit: string;
  private _cashDiscountAllowed: boolean;

  static createFromData(data: ContractItemData): ContractItem {
    if (data) {
      return new ContractItem(data);
    }
    return undefined;
  }

  constructor(data?: ContractItemData) {
    super();
    this.initialize();
    this.fill(data);
  }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }
  get pricePerUnit(): number { return this._pricePerUnit; }
  set pricePerUnit(value: number) { this._pricePerUnit = value; }
  get priceUnit(): string { return this._priceUnit; }
  set priceUnit(value: string) { this._priceUnit = value; }
  get cashDiscountAllowed(): boolean { return this._cashDiscountAllowed; }
  set cashDiscountAllowed(value: boolean) { this._cashDiscountAllowed = value; }

  get data(): ContractItemData {
    return {
      id: this._id,
      description: this._description,
      pricePerUnit: this._pricePerUnit,
      priceUnit: this._priceUnit,
      cashDiscountAllowed: this._cashDiscountAllowed
    };
  }
  protected fill(data?: ContractItemData): void {
    if (!data) { return; }
    if (data.id) { this._id = data.id; }
    if (data.description) { this._description = data.description; }
    if (data.pricePerUnit) { this._pricePerUnit = data.pricePerUnit; }
    if (data.priceUnit) { this._priceUnit = data.priceUnit; }
    if (data.cashDiscountAllowed) { this._cashDiscountAllowed = data.cashDiscountAllowed; }
  }
  protected initialize(): void {
    this._id = undefined;
    this._description = undefined;
    this._pricePerUnit = 0;
    this._priceUnit = undefined;
    this._cashDiscountAllowed = false;
  }
}

export type ContractsEntity = { [id: number]: ContractData };

export function mapContractsEntityToObjArray(entity: ContractsEntity): Contract[] {
  return Object.keys(entity).map(id => Contract.createFromData(entity[+id]));
}



