import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import * as fromStore from '../store/index';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/index';
import {SettingData} from '../models/setting.model';
import {Country} from '../models/country';
import {map, tap} from 'rxjs/operators';
import {Vat} from '../models/vat';
import {environment} from '../../environments/environment';


@Injectable()
export class SettingsBusinessService {

  language: string;

  constructor(private store: Store<fromStore.InvoicingState>,
              @Inject(LOCALE_ID) locale: string) {

    this.language = locale.substr(0, 2);
  }

  getSettings(): Observable<SettingData[]> {
    return this.store.select(fromStore.selectAllSettings);
  }

  getSupportedLanguages(): string[] {
    return environment.supportedLanguages;
  }

  getCountrySettings(): Observable<SettingData> {
    return this.store.select(fromStore.selectAllCountrySettings);
  }

  getCountries(): Observable<Country[]> {
    return this.store.select(fromStore.selectAllCountrySettings)
      .pipe(
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
    return this.store.select(fromStore.selectAllVatSettings);
  }

  throwError(err: any) {
    this.store.dispatch(new fromStore.UpdateSettingFail(err));
  }

  update(setting: SettingData) {
    this.store.dispatch(new fromStore.UpdateSetting(setting));
  }
}
