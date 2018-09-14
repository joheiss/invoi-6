import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import * as revenuesActions from '../actions/revenues.actions';
import * as fromServices from '../../services';
import {selectAuth} from '../../../auth/store/selectors';
import {UserData} from '../../../auth/models/user';
import * as fromRoot from '../../../app/store';
import {Store} from '@ngrx/store';

@Injectable()
export class RevenuesEffects {

  auth: UserData;

  constructor(private actions$: Actions,
              private revenuesService: fromServices.RevenuesService,
              private store: Store<fromRoot.AppState>) {
  }

  // FIRESTORE
@Effect()
queryRevenues$ = this.actions$
  .ofType(revenuesActions.QUERY_REVENUES)
  .pipe(
    switchMap(() => this.store.select(selectAuth)
      .pipe(
        filter(auth => !!auth),
        tap(auth => this.auth = auth),
        switchMap(action => this.revenuesService.queryAll()),
        mergeMap(actions => actions),
        filter(action => action.payload.doc.id.substring(5) === this.auth.organization),
        map(action => {
          const type = `[Invoicing] Revenue ${action.type}`;
          const payload = {...action.payload.doc.data(), id: action.payload.doc.id.substring(0, 4) };
          return { type, payload };
        })
      ))
  );
}
