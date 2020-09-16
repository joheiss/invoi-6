import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import * as fromSettings from '../actions/settings.actions';
import {SettingData} from 'jovisco-domain';

export interface SettingSingle {
  isDirty: boolean;
  setting: SettingData;
}
export interface SettingState extends EntityState<SettingData> {
  loaded: boolean;
  loading: boolean;
  current?: SettingSingle;
  error: any;
}

export const settingAdapter: EntityAdapter<SettingData> = createEntityAdapter<SettingData>({
  selectId: (setting: SettingData) => setting.id,
  sortComparer: (a: SettingData, b: SettingData) => a.id.localeCompare(b.id)
});

const initialState: SettingState = settingAdapter.getInitialState({
  loaded: false,
  loading: false,
  current: undefined,
  error: undefined
});

export function settingReducer(state: SettingState = initialState, action: fromSettings.SettingAction): SettingState {
  switch (action.type) {

    case fromSettings.QUERY_SETTINGS: {
      return { ...state, loading: true, loaded: false, error: undefined, current: undefined };
    }

    case fromSettings.ADDED_SETTING: {
      return settingAdapter.addOne(action.payload, {...state, loaded: true, loading: false, error: undefined });
    }

    case fromSettings.MODIFIED_SETTING: {
      return settingAdapter.updateOne({ id: action.payload.id, changes: action.payload }, {...state, error: undefined });
    }

    case fromSettings.REMOVED_SETTING: {
      return settingAdapter.removeOne(action.payload.id, state);
    }

    case fromSettings.COPY_SETTING_SUCCESS: {
      const current = { isDirty: true, setting: action.payload };
      return { ...state, current, error: undefined };
    }

    case fromSettings.NEW_SETTING_SUCCESS: {
      const current = { isDirty: true, setting: action.payload };
      return { ...state,  current, error: undefined };
    }

    case fromSettings.SELECT_SETTING: {
      const current = { isDirty: false, setting: action.payload };
      return { ...state,  current, error: undefined };
    }

    case fromSettings.CHANGE_SETTING_SUCCESS: {
      const current = { isDirty: true, setting: action.payload };
      return { ...state,  current, error: undefined };
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectSettingIds,
  selectEntities: selectSettingEntities,
  selectAll: selectAllSettings,
  selectTotal: selectSettingsTotal } = settingAdapter.getSelectors();

export const selectSettingsLoading = (state: SettingState) => state.loading;
export const selectSettingsLoaded = (state: SettingState) => state.loaded;
export const selectCurrentSetting = (state: SettingState) => state.current.setting;
export const selectSettingsError = (state: SettingState) => state.error;


