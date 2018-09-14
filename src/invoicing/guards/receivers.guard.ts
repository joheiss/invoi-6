import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';

import * as fromStore from '../store';
import {ObjectsGuard} from './objects.guard';

@Injectable()
export class ReceiversGuard extends ObjectsGuard {

  constructor(protected store: Store<fromStore.InvoicingState>) {
    super(store);
  }

  protected getObjectLoadedSelector(): any {
    return fromStore.selectReceiversLoaded;
  }

  protected getQueryAction(): Action {
    return new fromStore.QueryReceivers();
  }
}


