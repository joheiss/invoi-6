import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as uiActions from '../actions/ui.actions';

import {filter, first, map, switchMap, tap} from 'rxjs/operators';
import {UiService} from '../../../shared/services/ui.service';

@Injectable()
export class UiEffects {

  constructor(private actions$: Actions,
              private uiService: UiService) {
  }

  @Effect({dispatch: false})
  openSnackBar$ = this.actions$.pipe(
    ofType(uiActions.OPEN_SNACKBAR),
    map((action: uiActions.OpenSnackBar) => action.payload),
    tap(action => this.uiService.openSnackBar(action.message))
  );

  @Effect({dispatch: false})
  openUrl$ = this.actions$.pipe(
    ofType(uiActions.OPEN_URL),
    map((action: uiActions.OpenUrl) => action.payload),
    tap(downloadUrl => this.uiService.openUrl(downloadUrl))
  );

  @Effect()
  openConfirmationDialog$ = this.actions$.pipe(
    ofType(uiActions.OPEN_CONFIRMATION_DIALOG),
    map((action: uiActions.OpenConfirmationDialog) => action.payload),
    switchMap(payload => this.uiService.openConfirmationDialog(payload)
      .pipe(
        first(),
        filter(payload => payload.reply),
        map(payload => payload.do)
      ))
  );
}
