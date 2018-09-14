import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

import * as fromRoot from '../../../app/store';
import * as fromServices from '../../services';
import * as settingActions from '../actions/settings.actions';
import {Store} from '@ngrx/store';


@Injectable()
export class SettingsEffects {

  constructor(private actions$: Actions,
              private settingsService: fromServices.SettingsService,
              private store: Store<fromRoot.AppState>) {
  }

  // FIRESTORE
  @Effect()
  querySettings$ = this.actions$
    .ofType(settingActions.QUERY_SETTINGS)
    .pipe(
      switchMap(action => this.settingsService.queryAll()),
      mergeMap(actions => actions),
      map(action => {
        const type = `[Invoicing] Setting ${action.type}`;
        const payload = {...action.payload.doc.data() };
        return { type, payload };
      })
    );

  @Effect()
  updateSetting$ = this.actions$
    .ofType(settingActions.UPDATE_SETTING)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: settingActions.UpdateSetting) => action.payload),
      switchMap(setting => this.settingsService.update(setting)
        .pipe(
          map(setting => new settingActions.UpdateSettingSuccess(setting)),
          catchError(error => {
            console.error(error);
            return of(new settingActions.UpdateSettingFail(error));
          })
        ))
    );

  @Effect()
  updateSettingSuccess$ = this.actions$
    .ofType(settingActions.UPDATE_SETTING_SUCCESS)
    .pipe(
      map((action: settingActions.UpdateSettingSuccess) => action.payload),
      switchMap(setting => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.settingsService.getMessage('setting-update-success', [setting.id])
        }),
        // new fromRoot.Go({path: ['/invoicing/settings']})
      ])
    );

  @Effect()
  updateSettingFail$ = this.actions$
    .ofType(settingActions.UPDATE_SETTING_FAIL)
    .pipe(
      map((action: settingActions.UpdateSettingFail) => action.payload),
      switchMap(error => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.settingsService.getMessage('setting-update-fail', [error.message])
        })
      ])
    );

  // --- CREATING
  @Effect()
  createSetting$ = this.actions$.ofType(settingActions.CREATE_SETTING)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: settingActions.CreateSetting) => action.payload),
      switchMap(setting => this.settingsService.create(setting)
        .pipe(
          map(setting => new settingActions.CreateSettingSuccess(setting)),
          catchError(error => of(new settingActions.CreateSettingFail(error)))
        ))
    );

  @Effect()
  createSettingSuccess$ = this.actions$
    .ofType(settingActions.CREATE_SETTING_SUCCESS)
    .pipe(
      map((action: settingActions.CreateSettingSuccess) => action.payload),
      switchMap(setting => [
        new fromRoot.StopSpinning(),
        new fromRoot.Go({ path: ['/invoicing/settings', setting.id] })
      ])
    );

  @Effect()
 createSettingFail$ = this.actions$
    .ofType(settingActions.CREATE_SETTING_FAIL)
    .pipe(
      map((action: settingActions.CreateSettingFail) => action.payload),
      switchMap(error => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.settingsService.getMessage('setting-create-fail', [error.message])
        })
      ])
    );

  // DELETING
  @Effect()
  deleteSetting$ = this.actions$.ofType(settingActions.DELETE_SETTING)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: settingActions.DeleteSetting) => action.payload),
      switchMap(setting => this.settingsService.delete(setting)
        .pipe(
          map(() => new settingActions.DeleteSettingSuccess(setting)),
          catchError(error => of(new settingActions.DeleteSettingFail(error)))
        ))
    );

  @Effect()
  deleteSettingSuccess$ = this.actions$
    .ofType(settingActions.DELETE_SETTING_SUCCESS)
    .pipe(
      map((action: settingActions.DeleteSettingSuccess) => action.payload),
      switchMap(setting => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.settingsService.getMessage('setting-deleted', [setting.id])
        }),
        // new fromRoot.Go({path: ['/invoicing/settings']})
      ])
    );

  @Effect()
  deleteSettingFail$ = this.actions$
    .ofType(settingActions.DELETE_SETTING_FAIL)
    .pipe(
      map((action: settingActions.DeleteSettingFail) => action.payload),
      switchMap(error => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.settingsService.getMessage('setting-delete-fail', [error.message])
        })
      ])
    );

  // --- COPYING
  @Effect()
  copySettingSuccess$ = this.actions$
    .ofType(settingActions.COPY_SETTING_SUCCESS)
    .pipe(
      map((action: settingActions.CopySettingSuccess) => action.payload),
      map(setting => new fromRoot.Go({ path: ['/invoicing/settings', 'copy' ]}))
    );

  // --- NEW
  @Effect()
  newSettingSuccess$ = this.actions$
    .ofType(settingActions.NEW_SETTING_SUCCESS)
    .pipe(
      map((action: settingActions.NewSettingSuccess) => action.payload),
      map(setting => new fromRoot.Go({ path: ['/invoicing/settings', 'new' ]}))
    );
}
