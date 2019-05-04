import {Transaction} from 'jovisco-domain';

export class ObjectUiUtility {

  static getObjectUrl(object: Transaction): string {
    return `/invoicing/${object.header.objectType}`;
  }
}
