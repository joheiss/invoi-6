import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import * as uiActions from '../actions/ui.actions';

import {filter, map, switchMap, tap} from 'rxjs/operators';
import {UiService} from '../../../shared/services/ui.service';

@Injectable()
export class UiEffects {

  constructor(private actions$: Actions,
              private uiService: UiService) {
  }

  @Effect({dispatch: false})
  openSnackBar$ = this.actions$
    .ofType(uiActions.OPEN_SNACKBAR)
    .pipe(
      map((action: uiActions.OpenSnackBar) => action.payload),
      tap(action => this.uiService.openSnackBar(action.message)
      )
    );

  @Effect({dispatch: false})
  openUrl$ = this.actions$
    .ofType(uiActions.OPEN_URL)
    .pipe(
      map((action: uiActions.OpenUrl) => action.payload),
      tap(downloadUrl => this.uiService.openUrl(downloadUrl)
      )
    );

  @Effect()
  openConfirmationDialog$ = this.actions$
    .ofType(uiActions.OPEN_CONFIRMATION_DIALOG)
    .pipe(
      map((action: uiActions.OpenConfirmationDialog) => action.payload),
      switchMap(payload => this.uiService.openConfirmationDialog(payload)
        .pipe(
          filter(payload => payload.reply),
          map(payload => payload.do),
        ))
    );
}
