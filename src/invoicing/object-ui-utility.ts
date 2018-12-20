import {Transaction} from './models/transaction';

export class ObjectUiUtility {

  static getObjectUrl(object: Transaction): string {
    return `/invoicing/${object.header.objectType}`;
  }
}
