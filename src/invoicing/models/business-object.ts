import {DataObject} from './data-object';

export interface BusinessObjectHeaderData extends DataObject {
  id?: string;
  objectType?: string;
  organization?: string;
  isDeletable?: boolean;
}

export abstract class BusinessObject {
  abstract header?: BusinessObjectHeaderData;

  get ownerKey() {
    return `${this.header.objectType}/${this.header.id}`;
  }
}


