import {settingAdapter, SettingState} from '../../invoicing/store/reducers/settings.reducer';
import {CountryData} from 'jovisco-domain';
import {DateTime} from 'luxon';

export const mockSettingsState = (): SettingState => {
  const state = settingAdapter.getInitialState();
  return settingAdapter.addMany(mockAllSettings(), {...state, loading: false, loaded: true, current: undefined, error: undefined});
};

export const mockAllSettings = (): any => {
  return [mockAllCountries(), mockAllVatSettings()];
};

export const mockSingleCountry = (): CountryData => {
  return {isoCode: 'DE', names: {de: 'Deutschland', en: 'Germany', fr: 'Allemagne', it: 'Germania'}} as CountryData;
};

export const mockAllCountries = (): any => {
  return {
    id: 'countries',
    values: [
      {isoCode: 'AT', names: {de: 'Österreich', en: 'Austria'}},
      {isoCode: 'CH', names: {de: 'Schweiz', en: 'Switzerland', fr: 'Suisse'}},
      {isoCode: 'DE', names: {de: 'Deutschland', en: 'Germany', fr: 'Allemagne', it: 'Germania'}}
    ]
  };
};

export const mockSingleVatSetting = (): any => {
  const validFrom = DateTime.utc(2015, 1, 1).startOf('day').toJSDate();
  const validTo = DateTime.utc(9999, 12, 31).endOf('day').toJSDate();
  return {percentage: 19, taxCode: 'DE_full', validFrom: validFrom, validTo: validTo};
};

export const mockAllVatSettings = (): any => {
  const validFrom = DateTime.utc(2015, 1, 1).startOf('day').toJSDate();
  const validTo = DateTime.utc(9999, 12, 31).endOf('day').toJSDate();

  return {
    id: 'vat',
    values: [
      {percentage: 20, taxCode: 'AT_full', validFrom: validFrom, validTo: validTo},
      {percentage: 0, taxCode: 'AT_none', validFrom: validFrom, validTo: validTo},
      {percentage: 10, taxCode: 'AT_reduced', validFrom: validFrom, validTo: validTo},
      {percentage: 19, taxCode: 'DE_full', validFrom: validFrom, validTo: validTo},
      {percentage: 0, taxCode: 'DE_none', validFrom: validFrom, validTo: validTo},
      {percentage: 7, taxCode: 'DE_reduced', validFrom: validFrom, validTo: validTo},
      {percentage: 13, taxCode: 'AT_special', validFrom: validFrom, validTo: validTo}
    ].sort((a, b) => a.taxCode.localeCompare(b.taxCode))
  };
};


export const mockSettingsIds = (): string[] => {
  return mockAllSettings().map(s => s.id);
};

export const mockSettingsEntity = (): any => {
  const allSettings = mockAllSettings();
  const entity = {};
  allSettings.map(s => entity[s.id] = s);
  return entity;
};

