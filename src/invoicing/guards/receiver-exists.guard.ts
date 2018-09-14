import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {map, take, tap} from 'rxjs/operators';

import * as fromStore from '../store';
import {ObjectExistsGuard} from './object-exists.guard';


@Injectable()
export class ReceiverExistsGuard extends ObjectExistsGuard {

  constructor(protected store: Store<fromStore.InvoicingState>) {
    super(store);
  }

  protected hasObject(id: string): Observable<boolean> {
    return this.store.select(fromStore.selectReceiverEntities)
      .pipe(
        tap(entity => this.store.dispatch(new fromStore.SelectReceiver(entity[id]))),
        map(entity => !!entity[id]),
        take(1)
      );
  }
}


