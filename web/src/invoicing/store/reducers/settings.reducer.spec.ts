import {
  AddedSetting,
  ChangeSettingSuccess,
  CopySettingSuccess,
  ModifiedSetting,
  NewSettingSuccess,
  QuerySettings,
  RemovedSetting,
  SelectSetting,
} from '../actions';
import {settingAdapter, settingReducer, SettingState} from './settings.reducer';
import {mockAllCountries} from '../../../test/factories/mock-settings.factory';

describe('Settings Reducer', () => {

  const initialState: SettingState = settingAdapter.getInitialState({
    loading: false,
    loaded: false,
    current: undefined,
    error: undefined
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'Noop' } as any;
      const result = settingReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Query Settings Action', () => {
    it('should toggle the loading state', () => {
      const action = new QuerySettings();
      const result = settingReducer(undefined, action);
      expect(result).toEqual({...initialState, loading: true });
    });
  });

  describe('Added Setting Event', () => {
    it('should toggle the loading state and add a setting to the state', () => {
      const setting = mockAllCountries();
      const action = new AddedSetting(setting);
      const result = settingReducer(undefined, action);
      expect(result).toEqual({
        ...initialState,
        entities: { [setting.id]: setting },
        ids: [setting.id],
        loading: false,
        loaded: true
      });
    });
  });

  describe('Modified Setting Event', () => {
    it('should update the setting in the state', () => {
      const setting = mockAllCountries();
      const someState = {
        ...initialState,
        entities: { [setting.id]: setting },
        ids: [setting.id],
        loading: false,
        loaded: true
      };
      const modifiedSetting = { ...setting };
      const action = new ModifiedSetting(modifiedSetting);
      const result = settingReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: { [setting.id]: modifiedSetting }
      });
    });
  });

  describe('Removed Setting Event', () => {
    it('should remove the setting from the state', () => {
      const setting = mockAllCountries();
      const someState = {
        ...initialState,
        entities: { [setting.id]: setting },
        ids: [setting.id],
        loading: false,
        loaded: true
      };
      const action = new RemovedSetting(setting);
      const result = settingReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: {},
        ids: []
      });
    });
  });

  describe('Copy Setting Success Event', () => {
    it('should set the current setting in state', () => {
      const setting = mockAllCountries();
      const someState = {
        ...initialState,
        entities: { [setting.id]: setting },
        ids: [setting.id],
        loading: false,
        loaded: true
      };
      const action = new CopySettingSuccess(setting);
      const result = settingReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, setting: setting },
        error: undefined
      });
    });
  });

  describe('New Setting Success Event', () => {
    it('should set the current setting in state', () => {
      const setting = mockAllCountries();
      const someState = {
        ...initialState,
        entities: { [setting.id]: setting },
        ids: [setting.id],
        loading: false,
        loaded: true
      };
      const action = new NewSettingSuccess(setting);
      const result = settingReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, setting: setting },
        error: undefined
      });
    });
  });

  describe('Select Setting Command', () => {
    it('should set the current setting in state', () => {
      const setting = mockAllCountries();
      const someState = {
        ...initialState,
        entities: { [setting.id]: setting },
        ids: [setting.id],
        loading: false,
        loaded: true
      };
      const action = new SelectSetting(setting);
      const result = settingReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: false, setting: setting },
        error: undefined
      });
    });
  });

  describe('Change Setting Success Event', () => {
    it('should set the current setting in state', () => {
      const setting = mockAllCountries();
      const someState = {
        ...initialState,
        entities: { [setting.id]: setting },
        ids: [setting.id],
        loading: false,
        loaded: true
      };
      const action = new ChangeSettingSuccess(setting);
      const result = settingReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, setting: setting },
        error: undefined
      });
    });
  });
  
});
