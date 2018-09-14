import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import * as openInvoicesActions from '../actions/open-invoices.actions';
import * as fromServices from '../../services';
import {selectAuth} from '../../../auth/store/selectors';
import * as fromRoot from '../../../app/store';
import {Store} from '@ngrx/store';
import {UserData} from '../../../auth/models/user';

@Injectable()
export class OpenInvoicesEffects {

  auth: UserData;

  constructor(private actions$: Actions,
              private openInvoicesService: fromServices.OpenInvoicesService,
              private store: Store<fromRoot.AppState>) {
  }

  // FIRESTORE
@Effect()
queryOpenInvoices$ = this.actions$
  .ofType(openInvoicesActions.QUERY_OPEN_INVOICES)
  .pipe(
    switchMap(() => this.store.select(selectAuth)
      .pipe(
        filter(auth => !!auth),
        tap(auth => this.auth = auth),
        switchMap(action => this.openInvoicesService.queryAll()),
        mergeMap(actions => actions),
        filter(action => action.payload.doc.data().organization === this.auth.organization),
        map(action => {
          console.log('OpenInvoice incoming Action: ', action);
          const type = `[Invoicing] OpenInvoice ${action.type}`;
          const payload = {...action.payload.doc.data(), id: action.payload.doc.id };
          return { type, payload };
        })
      ))
  );
}
