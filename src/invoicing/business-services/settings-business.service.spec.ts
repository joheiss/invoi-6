import {select, Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {SettingsBusinessService} from './settings-business.service';
import {LOCALE_ID} from '@angular/core';
import {Country} from '../models/country';
import {of} from 'rxjs/index';
import * as fromStore from '../store';
import {map, take} from 'rxjs/operators';

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
          keyValues.push({isoCode: country.isoCode, name: country.names[this.language]});
        });
        return keyValues;
      }),
      take(1)
    )
      .subscribe(countries => {
        expect(countries.length).toBe(3);
        done();
      });
  });
});

const mockAllCountries = (): any => {
  return {
    id: 'countries',
    values: [
      {isoCode: 'AT', names: {de: 'Österreich', en: 'Austria'}},
      {isoCode: 'CH', names: {de: 'Schweiz', en: 'Switzerland', fr: 'Suisse'}},
      {isoCode: 'DE', names: {de: 'Deutschland', en: 'Germany', fr: 'Allemagne', it: 'Germania'}}
    ]
  };
};
