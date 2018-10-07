import {BusinessObjectHeaderData} from './business-object';
import {MasterData} from './master-data';

export interface ReceiverHeaderData extends BusinessObjectHeaderData {
  name?: string;
  nameAdd?: string;
  logoUrl?: string;
  status?: ReceiverStatus;
  // isDeletable?: boolean;
  // lastContractId?: string;
  // lastInvoiceId?: string;
  // recentContractIds?: string[];
  // openInvoiceIds?: string[];
}

export interface ReceiverAddressData {
  country?: string;
  postalCode?: string;
  city?: string;
  street?: string;
  email?: string;
  phone?: string;
  fax?: string;
  webSite?: string;
}

export enum ReceiverStatus {
  active,
  inactive
}

export interface ReceiverData extends ReceiverHeaderData {
  address?: ReceiverAddressData;
}

export class Receiver extends MasterData {
  public static createFromData(data: ReceiverData) {
    if (data) {
      const header = Receiver.extractHeaderFromData(data);
      const address = Receiver.extractAddressFromData(data);
      return new Receiver(header, address);
    }
    return undefined;
  }

  private static extractAddressFromData(data: ReceiverData): ReceiverAddressData {
    return data.address;
  }

  private static extractHeaderFromData(data: ReceiverData): ReceiverHeaderData {
    const {address: removed1, ...header} = data;
    return header;
  }

  constructor(public header?: ReceiverHeaderData,
              public address?: ReceiverAddressData) {
    super();
  }

  get data(): ReceiverData {
    return {
      ...this.header,
      address: this.address,
    };
  }

  public isActive(): boolean {
    return this.header.status.valueOf() === ReceiverStatus.active.valueOf();
  }

  public isPersistent(): boolean {
    return !!this.header.id;
  }
}

export type ReceiversEntity = { [id: string]: ReceiverData };

export function mapReceiversEntityToObjArray(entity: ReceiversEntity): Receiver[] {
  return Object.keys(entity).map(id => Receiver.createFromData(entity[id]));
}




