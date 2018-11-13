import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromSettings from '../reducers/settings.reducer';

export const selectSettingState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.settings
);

export const selectSettingEntities = createSelector(
  selectSettingState,
  fromSettings.selectSettingEntities
);

export const selectAllSettings = createSelector(
  selectSettingState,
  fromSettings.selectAllSettings
);

export const selectSettingsLoaded = createSelector(
  selectSettingState,
  fromSettings.selectSettingsLoaded
);

export const selectAllCountrySettings = createSelector(
  selectSettingEntities,
  entities => entities['countries']
);

export const selectAllVatSettings = createSelector(
  selectSettingEntities,
  entities => entities['vat']
);






