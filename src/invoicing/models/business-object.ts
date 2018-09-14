export interface BusinessObjectHeaderData {
  id?: string;
  objectType?: string;
  organization?: string;
}

export abstract class BusinessObject {
  abstract header?: BusinessObjectHeaderData;

  get ownerKey() {
    return `${this.header.objectType}/${this.header.id}`;
  }
}


