import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import * as fromStore from '../../invoicing/store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/index';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {CountryData, SettingData} from 'jovisco-domain';

@Injectable()
export class SettingsBusinessService {

  language: string;

  constructor(private store: Store<fromStore.InvoicingState>,
              @Inject(LOCALE_ID) locale: string) {

    this.language = locale.substr(0, 2);
  }

  getSettings(): Observable<SettingData[]> {
    return this.store.pipe(select(fromStore.selectAllSettings));
  }

  getSupportedLanguages(): string[] {
    return environment.supportedLanguages;
  }

  getCountrySettings(): Observable<SettingData> {
    return this.store.pipe(select(fromStore.selectAllCountrySettings));
  }

  getCountries(): Observable<CountryData[]> {
    return this.store.pipe(
      select(fromStore.selectAllCountrySettings),
      map(countries => this.mapCountriesToArray(countries))
    );
  }

  getVatSettings(): Observable<SettingData> {
    return this.store.pipe(select(fromStore.selectAllVatSettings));
  }

  throwError(err: any) {
    this.store.dispatch(new fromStore.UpdateSettingFail(err));
  }

  update(setting: SettingData) {
    this.store.dispatch(new fromStore.UpdateSetting(setting));
  }

  private mapCountriesToArray(countries: SettingData): CountryData[] {
    const keyValues = [];
    countries.values.forEach(country => {
      keyValues.push({isoCode: country.isoCode, name: country.names[this.language]});
    });
    return keyValues;
  }
}
