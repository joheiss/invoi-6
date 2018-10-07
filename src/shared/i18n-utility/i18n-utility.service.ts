import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import * as moment from 'moment';

export interface LocaleNumberFormattingInfo {
  decimalSeparator: string;
  thousandSeparator: string;
  numberOfDecimals: number;
}

@Injectable()
export class I18nUtilityService {

  private readonly formattingInfo: LocaleNumberFormattingInfo;
  private readonly decimalSeparatorEscaped: string;
  private readonly thousandSeparatorEscaped: string;

  constructor(@Inject(LOCALE_ID) private locale: string,
              private decimalPipe: DecimalPipe) {
    // determine separators.
   this.formattingInfo = this.getFormattingInfo();
    // escape separators for regex
    this.decimalSeparatorEscaped = this.escapeForRegex(this.formattingInfo.decimalSeparator);
    this.thousandSeparatorEscaped = this.escapeForRegex(this.formattingInfo.thousandSeparator);
  }

  public fromLocalAmount(amount: any): number {
    if (!amount) { return 0;  }
    if (typeof amount !== 'string') { return amount; }

    const toBeConverted = amount
      .replace(new RegExp(this.thousandSeparatorEscaped, 'g'), '')
      .replace(new RegExp(this.decimalSeparatorEscaped, 'g'), '.');
    return parseFloat(toBeConverted);
  }

  public toLocalAmount(amount: number): string {
    if (isNaN(amount)) {
      return null;
    }
    return this.decimalPipe.transform(amount, '1.2-2');
  }

  public fromLocalPercent(percent: string): number {
    return this.fromLocalAmount(percent);
  }

  public toLocalPercent(percent: number): string {
    if (!percent && percent !== 0) {
      return null;
    }
    return this.decimalPipe.transform(percent, '1.1-3');
  }

  public toLocalISOString(d: Date): string {
    if (!d) {
      return null;
    }
    const pad = function (n) { return n < 10 ? '0' + n : n; };
    const tz = d.getTimezoneOffset();
    let tzs = (tz > 0 ? '-' : '+') + pad(Math.abs(tz / 60));

    if (tz % 60 !== 0) {
      tzs += pad(Math.abs(tz % 60));
    }

    if (tz === 0) {
      tzs = 'Z';
    }// Zulu time == UTC

    return d.getFullYear() + '-'
      + pad(d.getMonth() + 1) + '-'
      + pad(d.getDate()) + 'T'
      + pad(d.getHours()) + ':'
      + pad(d.getMinutes()) + ':'
      + pad(d.getSeconds()) + tzs;
  }

  public toLocalDateISOString(d: Date): string {
    return this.toLocalISOString(d).substr(0, 10);
  }

  public generateAbbrevMonthNames(): string[] {
    const months = [];
    const start = moment('2017-12-01');
    start.locale(this.locale);
    for (let i = 0; i < 12; i++) {
      start.add(1, 'month');
      months.push(start.format('MMM'));
    }
    return months;
  }

  private escapeForRegex(str: string): string {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  private getFormattingInfo(): LocaleNumberFormattingInfo {
    return {
      decimalSeparator: this.getDecimalSeparator(),
      thousandSeparator: this.getThousandSeparator(),
      numberOfDecimals: this.getNumberOfDecimals()

    };
  }

  private getDecimalSeparator(): string {
    return (12345.6789).toLocaleString().match(/345(.*)67/)[1];
  }

  private getThousandSeparator(): string {
    return (12345.6789).toLocaleString().match(/12(.*)345/)[1];
  }

  private getNumberOfDecimals(): number {
    return (12345.6789).toLocaleString().match(/345(\D*)(\d+)$/)[2].length;
  }
}
