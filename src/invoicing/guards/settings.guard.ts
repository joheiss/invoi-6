import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';

import * as fromStore from '../store';
import {ObjectsGuard} from './objects.guard';

@Injectable()
export class SettingsGuard extends ObjectsGuard {

  constructor(protected store: Store<fromStore.InvoicingState>) {
    super(store);
  }

  protected getObjectLoadedSelector(): any {
    return fromStore.selectSettingsLoaded;
  }

  protected getQueryAction(): Action {
    return new fromStore.QuerySettings();
  }
}
