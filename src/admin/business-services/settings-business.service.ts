import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import * as fromStore from '../../invoicing/store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/index';
import {SettingData} from '../models/setting.model';
import {Country} from '../models/country';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
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

  getCountries(): Observable<Country[]> {
    return this.store.pipe(
      select(fromStore.selectAllCountrySettings),
      map(countries => {
        const keyValues = [];
        countries.values.forEach(country => {
          keyValues.push({isoCode: country.isoCode, name: country.names[this.language]});
        });
        return keyValues;
      })
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
}
