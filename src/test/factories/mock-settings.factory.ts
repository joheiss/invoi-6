import {DateUtilities} from '../../shared/utilities/date-utilities';
import {Country} from '../../invoicing/models/country';
import {settingAdapter, SettingState} from '../../invoicing/store/reducers/settings.reducer';

export const mockSettingsState = (): SettingState => {
  const state = settingAdapter.getInitialState();
  return settingAdapter.addMany(mockAllSettings(), {...state, loading: false, loaded: true, current: undefined, error: undefined});
};

export const mockAllSettings = (): any => {
  return [mockAllCountries(), mockAllVatSettings()];
};

export const mockSingleCountry = (): Country => {
  return {isoCode: 'DE', names: {de: 'Deutschland', en: 'Germany', fr: 'Allemagne', it: 'Germania'}} as Country;
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
  const validFrom = DateUtilities.getDateOnly(new Date(2015, 0, 1));
  const validTo = DateUtilities.getDateOnly(new Date(9999, 11, 31));
  return {percentage: 19, taxCode: 'DE_full', validFrom: validFrom, validTo: validTo};
};

export const mockAllVatSettings = (): any => {
  const validFrom = DateUtilities.getDateOnly(new Date(2015, 0, 1));
  const validTo = DateUtilities.getDateOnly(new Date(9999, 11, 31));

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

