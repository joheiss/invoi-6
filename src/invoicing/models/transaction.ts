import {BusinessObjectHeaderData} from './business-object';

export interface TransactionHeaderData extends BusinessObjectHeaderData {
  issuedAt?: Date;
}

export interface TransactionItemData {
  id?: number;
}

export interface TransactionData extends TransactionHeaderData {
  items?: TransactionItemData;
}

export abstract class Transaction {
  abstract header?: TransactionHeaderData;
  abstract items?: TransactionItem[];

  abstract get data(): any;

  get ownerKey() {
    return `${this.header.objectType}/${this.header.id}`;
  }

  public addItem(item: TransactionItem): any {
    this.items.push(item);
    return item;
  }

  abstract buildNewItemFromTemplate(): any;

  getItem(id: number): any {
    return this.items.find(item => item.data.id === id);
  }

  getNextItemId(): number {
    if (this.items.length === 0) {
      return 1;
    }
    // get ids
    const ids = this.items.map(item => item.data.id).sort();
    // find gap in id numbers
    const gaps = ids.filter((id, i) => id !== i + 1);
    // free id number is either gap or max + 1
    const id = gaps.length > 0 ? gaps[0] - 1 : ids[ids.length - 1] + 1;
    // build item template
    return id;
  }

  removeItem(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  protected getItemsData(): any[] {
    return this.items.map(item => item.data);
  }
}

export abstract class TransactionItem {
  protected _id?: number;

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  abstract get data(): any;

  protected abstract initialize();
  protected abstract fill(data?: any);

}
