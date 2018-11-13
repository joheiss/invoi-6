import {mockState} from '../../../test/factories/mock-state';
import {
  selectAllCountrySettings,
  selectAllSettings,
  selectAllVatSettings,
  selectSettingEntities,
  selectSettingsLoaded
} from './settings.selectors';
import {mockAllCountries, mockAllVatSettings, mockSettingsState} from '../../../test/factories/mock-settings.factory';

describe('Settings Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState();
  });

  describe('selectSettingEntities', () => {
    it('should return the entities object containing all settings', () => {
      expect(selectSettingEntities(state)).toEqual(state.invoicing.settings.entities);
    });
  });

  describe('selectAllSettings', () => {
    it('should return an array containing all settings', () => {
      const expected = Object.keys(state.invoicing.settings.entities)
        .map(k => state.invoicing.settings.entities[k]);
      expect(selectAllSettings(state)).toEqual(expected);
    });
  });

  describe('selectSettingsLoaded', () => {
    it('should return true ', () => {
      const expected = state.invoicing.settings.loaded;
      expect(selectSettingsLoaded(state)).toEqual(expected);
    });
  });

  describe('selectAllCountrySetting', () => {
    it('should return all country settings', () => {
      const expected = mockAllCountries();
      expect(selectAllCountrySettings(state)).toEqual(expected);
    });
  });

  describe('selectAllVatSetting', () => {
    it('should return all vat settings', () => {
      const expected = mockAllVatSettings();
      expect(selectAllVatSettings(state)).toEqual(expected);
    });
  });
});
