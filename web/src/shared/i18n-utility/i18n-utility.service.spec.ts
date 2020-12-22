import {TestBed} from '@angular/core/testing';
import {LOCALE_ID} from '@angular/core';
import {I18nUtilityService} from './i18n-utility.service';
import {DecimalPipe, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

describe('I18N Utilities', async () => {

  let service: I18nUtilityService;
  const localAmount = '1.234.567,89';
  const numAmount = 1234567.89;
  const localPercent = '98,76';
  const numPercent = 98.76;
  const date = new Date(2018, 11, 31);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        { provide: LOCALE_ID, useValue: 'de-DE' },
        DecimalPipe,
        I18nUtilityService
      ]
    });
    service = TestBed.inject(I18nUtilityService);
    // f...ing node does only support english natively ...
    // @ts-ignore
    service.formattingInfo = {
      decimalSeparator: ',',
      thousandSeparator: '.',
      numberOfDecimals: 2
    };
    // @ts-ignore
    service.decimalSeparatorEscaped = service.escapeForRegex(service.formattingInfo.decimalSeparator);
    // @ts-ignore
    service.thousandSeparatorEscaped = service.escapeForRegex(service.formattingInfo.thousandSeparator);

    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  describe('fromLocalAmount', () => {
    it('should convert a local amount string into a valid number', async () => {

      return expect(service.fromLocalAmount(localAmount)).toEqual(numAmount);
    });
  });

  describe('toLocalAmount', () => {
    it('should convert an amount (number) into a local amount string', async () => {

      return expect(service.toLocalAmount(numAmount)).toEqual(localAmount);
    });
  });

  describe('fromLocalPercent', () => {
    it('should convert a local percentage string into a valid number', async () => {

      return expect(service.fromLocalPercent(localPercent)).toEqual(numPercent);
    });
  });

  describe('toLocalPercent', () => {
    it('should convert a percentage (number) into a local percentage string', async () => {

      return expect(service.toLocalPercent(numPercent)).toEqual(localPercent);
    });
  });

  describe('toLocalISOString', () => {
    it('should convert a date to a local ISO string', async () => {
      return expect(service.toLocalISOString(date)).toEqual('2018-12-31T00:00:00+01');
    });
  });

  describe('toLocalDateISOString', () => {
    it('should convert a date to a local ISO date string', async () => {
      return expect(service.toLocalDateISOString(date)).toEqual('2018-12-31');
    });
  });

  describe('generateAbbrevMonthNames', () => {
    it('should return an array of 12 month abbreviations', async () => {
      // @ts-ignore
      service.locale = 'de';
      await expect(service.generateAbbrevMonthNames().length).toBe(12);
      const expected = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
      return expect(service.generateAbbrevMonthNames()).toEqual(expected);
    });
  });
});

