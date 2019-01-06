import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/index';

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
  querySettings$ = this.actions$.pipe(
    ofType(settingActions.QUERY_SETTINGS),
    switchMap(action => this.settingsService.queryAll()),
    mergeMap(actions => actions),
    map(action => {
      const type = `[Invoicing] Setting ${action.type}`;
      const payload = {...action.payload.doc.data()};
      payload.values.forEach(value => {
        if (value.validFrom) {
          value.validFrom = value.validFrom.toDate();
        }
        if (value.validTo) {
          value.validTo = value.validTo.toDate();
        }
      });
      return {type, payload};
    })
  );

  @Effect()
  updateSetting$ = this.actions$.pipe(
    ofType(settingActions.UPDATE_SETTING),
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
  updateSettingSuccess$ = this.actions$.pipe(
    ofType(settingActions.UPDATE_SETTING_SUCCESS),
    map((action: settingActions.UpdateSettingSuccess) => action.payload),
    mergeMap(setting => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.settingsService.getMessage('setting-update-success', [setting.id])
      }),
      // new fromRoot.Go({path: ['/invoicing/settings']})
    ])
  );

  @Effect()
  updateSettingFail$ = this.actions$.pipe(
    ofType(settingActions.UPDATE_SETTING_FAIL),
    map((action: settingActions.UpdateSettingFail) => action.payload),
    mergeMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.settingsService.getMessage('setting-update-fail', [error.message])
      })
    ])
  );

  // --- CREATING
  @Effect()
  createSetting$ = this.actions$.pipe(
    ofType(settingActions.CREATE_SETTING),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: settingActions.CreateSetting) => action.payload),
    switchMap(setting => this.settingsService.create(setting)
      .pipe(
        map(setting => new settingActions.CreateSettingSuccess(setting)),
        catchError(error => of(new settingActions.CreateSettingFail(error)))
      ))
  );

  @Effect()
  createSettingSuccess$ = this.actions$.pipe(
    ofType(settingActions.CREATE_SETTING_SUCCESS),
    map((action: settingActions.CreateSettingSuccess) => action.payload),
    mergeMap(setting => [
      new fromRoot.StopSpinning(),
      new fromRoot.Go({path: ['/invoicing/settings', setting.id]})
    ])
  );

  @Effect()
  createSettingFail$ = this.actions$.pipe(
    ofType(settingActions.CREATE_SETTING_FAIL),
    map((action: settingActions.CreateSettingFail) => action.payload),
    mergeMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.settingsService.getMessage('setting-create-fail', [error.message])
      })
    ])
  );

  // DELETING
  @Effect()
  deleteSetting$ = this.actions$.pipe(
    ofType(settingActions.DELETE_SETTING),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: settingActions.DeleteSetting) => action.payload),
    switchMap(setting => this.settingsService.delete(setting)
      .pipe(
        map(() => new settingActions.DeleteSettingSuccess(setting)),
        catchError(error => of(new settingActions.DeleteSettingFail(error)))
      ))
  );

  @Effect()
  deleteSettingSuccess$ = this.actions$.pipe(
    ofType(settingActions.DELETE_SETTING_SUCCESS),
    map((action: settingActions.DeleteSettingSuccess) => action.payload),
    mergeMap(setting => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.settingsService.getMessage('setting-deleted', [setting.id])
      }),
      // new fromRoot.Go({path: ['/invoicing/settings']})
    ])
  );

  @Effect()
  deleteSettingFail$ = this.actions$.pipe(
    ofType(settingActions.DELETE_SETTING_FAIL),
    map((action: settingActions.DeleteSettingFail) => action.payload),
    mergeMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.settingsService.getMessage('setting-delete-fail', [error.message])
      })
    ])
  );

  // --- COPYING
  @Effect()
  copySettingSuccess$ = this.actions$.pipe(
    ofType(settingActions.COPY_SETTING_SUCCESS),
    map((action: settingActions.CopySettingSuccess) => action.payload),
    map(setting => new fromRoot.Go({path: ['/invoicing/settings', 'copy']}))
  );

  // --- NEW
  @Effect()
  newSettingSuccess$ = this.actions$.pipe(
    ofType(settingActions.NEW_SETTING_SUCCESS),
    map((action: settingActions.NewSettingSuccess) => action.payload),
    map(setting => new fromRoot.Go({path: ['/invoicing/settings', 'new']}))
  );
}
