import {Store} from '@ngrx/store';
import {InvoicingState} from '../../invoicing/store/reducers';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {SettingsBusinessService} from './settings-business.service';
import {LOCALE_ID} from '@angular/core';
import {of} from 'rxjs/index';
import {map, take} from 'rxjs/operators';
import {UpdateSetting, UpdateSettingFail} from '../../invoicing/store/actions';
import {mockAllCountries} from '../../test/factories/mock-settings.factory';
import {SettingData} from 'jovisco-domain';

describe('Settings Business Service', () => {

  let store: Store<InvoicingState>;
  let service: SettingsBusinessService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => cold('-b|', {b: true}))
          }
        },
        {provide: LOCALE_ID, useValue: 'de-DE'},
        SettingsBusinessService
      ]
    });
    store = TestBed.get(Store);
    service = TestBed.get(SettingsBusinessService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    service.language = 'de';
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  it('should invoke store selector if getSettings is processed', () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getSettings();
    expect(spy).toHaveBeenCalled();
  });

  it('should return the supported languages from environment', () => {
    expect(service.getSupportedLanguages()).toEqual(['de', 'en']);
  });

  it('should invoke store selector if getCountrySettings is processed', () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getCountrySettings();
    expect(spy).toHaveBeenCalled();
  });

  it('should return country settings', done => {
    const allCountries = mockAllCountries();
    const allCountries$ = of(allCountries);
    allCountries$.pipe(
      map(countries => {
        const keyValues = [];
        countries.values.forEach(country => {
          keyValues.push({isoCode: country.isoCode, name: country.names[service.language]});
        });
        return keyValues;
      }),
      take(1)
    )
      .subscribe(countries => {
        expect(countries.length).toBe(3);
        const country = countries.find(c => c.isoCode === 'DE');
        expect(country.name).toEqual('Deutschland');
        done();
      });
  });

  it('should invoke store selector if getVatSettings is processed', () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getVatSettings();
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch UpdateSettingFail event if update on settings fails', async () => {
    const error = new Error('settings_update_fail');
    const action = new UpdateSettingFail(error);
    const spy = jest.spyOn(store, 'dispatch');
    service.throwError(error);
    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch UpdateSetting action when update is processed', async () => {
    const setting: SettingData = {
      id: 'anything',
      values: { something: true }
    };
    const action = new UpdateSetting(setting);
    const spy = jest.spyOn(store, 'dispatch');
    service.update(setting);
    expect(spy).toHaveBeenCalledWith(action);
  });

});

