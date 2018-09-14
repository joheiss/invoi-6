import {createSelector} from '@ngrx/store';
import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromSettings from '../reducers/settings.reducer';

export const selectSettingState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.settings
);

export const selectSettingIds = createSelector(
  selectSettingState,
  fromSettings.selectSettingIds
);

export const selectSettingEntities = createSelector(
  selectSettingState,
  fromSettings.selectSettingEntities
);

export const selectAllSettings = createSelector(
  selectSettingState,
  fromSettings.selectAllSettings
);

export const selectAllSettingsAsObjArray = createSelector(
  selectAllSettings,
  settings => settings.map(setting => setting)
);

export const selectSettingsTotal = createSelector(
  selectSettingState,
  fromSettings.selectSettingsTotal
);

export const selectSettingsLoading = createSelector(
  selectSettingState,
  fromSettings.selectSettingsLoading
);

export const selectSettingsLoaded = createSelector(
  selectSettingState,
  fromSettings.selectSettingsLoaded
);

export const selectCurrentSetting = createSelector(
  selectSettingState,
  fromSettings.selectCurrentSetting
);

export const selectCurrentSettingAsObj = createSelector(
  selectCurrentSetting,
  setting => setting
);


export const selectSettingsError = createSelector(
  selectSettingState,
  fromSettings.selectSettingsError
);

export const selectSelectedSetting = createSelector(
  selectSettingEntities,
  fromRoot.getRouterState,
  (entity, router) => router.state && entity[router.state.params.id]
);

export const selectAllCountrySettings = createSelector(
  selectSettingEntities,
  entities => entities['countries']
);

export const selectAllVatSettings = createSelector(
  selectSettingEntities,
  entities => entities['vat']
);






