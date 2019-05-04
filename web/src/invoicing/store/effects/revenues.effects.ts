import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import * as revenuesActions from '../actions/revenues.actions';
import * as fromServices from '../../services';
import {selectAuth} from '../../../auth/store/selectors';
import * as fromRoot from '../../../app/store';
import {select, Store} from '@ngrx/store';
import {UserData} from 'jovisco-domain';

@Injectable()
export class RevenuesEffects {

  auth: UserData;

  constructor(private actions$: Actions,
              private revenuesService: fromServices.RevenuesService,
              private store: Store<fromRoot.AppState>) {
  }

  // FIRESTORE
  @Effect()
  queryRevenues$ = this.actions$.pipe(
    ofType(revenuesActions.QUERY_REVENUES),
    map((action: revenuesActions.QueryRevenues) => action.payload),
    switchMap(() => this.store.pipe(select(selectAuth))
      .pipe(
        filter(auth => !!auth),
        tap(auth => this.auth = auth),
        switchMap(action => this.revenuesService.queryAll()),
        mergeMap(actions => actions),
        filter(action => action.payload.doc.data().organization === this.auth.organization),
        map(action => {
          const type = `[Invoicing] Revenue ${action.type}`;
          const payload = {...action.payload.doc.data(), id: action.payload.doc.id.substring(0, 4)};
          return {type, payload};
        })
      ))
  );
}
