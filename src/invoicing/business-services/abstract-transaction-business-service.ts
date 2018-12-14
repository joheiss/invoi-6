import {Transaction, TransactionItem} from '../models/transaction';
import {AbstractBoBusinessService} from './abstract-bo-business.service';
import {Action, select, Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {Observable} from 'rxjs/index';
import {Summary} from '../models/invoicing.model';
import {OpenConfirmationDialog} from '../../app/store';

export abstract class AbstractTransactionBusinessService<T extends Transaction, S extends Summary> extends AbstractBoBusinessService<T, S> {

  protected constructor(protected store: Store<InvoicingState>) {
    super(store);
  }

  addItem(object: T) {
    object.items.push(this.newItem(object));
    this.change(object);
  }


  protected abstract buildItem(data: any): TransactionItem;

  protected abstract getItemTemplate(): any;

  protected abstract getNextId(object: T): string;

  newItem(object: T): any {
    const itemData = Object.assign({}, {id: object.getNextItemId()}, {...this.getItemTemplate()});
    return this.buildItem(itemData);
  }

  removeItem(object: T, itemId: number) {
    object.items = object.items.filter(item => item.data.id !== itemId);
    this.change(object);
  }

}
