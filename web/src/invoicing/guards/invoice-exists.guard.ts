import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/index';
import {map, take, tap} from 'rxjs/operators';

import * as fromStore from '../store';
import {ObjectExistsGuard} from './object-exists.guard';

@Injectable()
export class InvoiceExistsGuard extends ObjectExistsGuard {

  constructor(protected store: Store<fromStore.InvoicingState>) {
    super(store);
  }

  protected hasCurrentObject(): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.selectCurrentInvoice),
      map(current => !!current),
      take(1)
    );
  }

  protected hasObject(id: string): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.selectInvoiceEntities),
      tap(entity => this.store.dispatch(new fromStore.SelectInvoice(entity[id]))),
      map(entity => !!entity[id]),
      take(1)
    );
  }
}
