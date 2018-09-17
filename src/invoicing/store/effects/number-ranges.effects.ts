import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import * as numberRangesActions from '../actions/number-ranges.actions';
import * as fromServices from '../../services';

@Injectable()
export class NumberRangesEffects {

  constructor(private actions$: Actions,
              private numberRangesService: fromServices.NumberRangesService) {
  }

  // FIRESTORE
  @Effect()
  queryNumberRanges$ = this.actions$.pipe(
    ofType(numberRangesActions.QUERY_NUMBER_RANGES),
    switchMap(action => this.numberRangesService.queryAll()),
    mergeMap(actions => actions),
    map(action => {
      const type = `[Invoicing] Number Range ${action.type}`;
      const payload = {...action.payload.doc.data(), id: action.payload.doc.id};
      return {type, payload};
    })
  );

  @Effect()
  updateNumberRange = this.actions$.pipe(
    ofType(numberRangesActions.UPDATE_NUMBER_RANGE),
    map((action: numberRangesActions.UpdateNumberRange) => action),
    switchMap(data => this.numberRangesService.update(data)),
    map(() => new numberRangesActions.UpdateNumberRangeSuccess())
  );

}
