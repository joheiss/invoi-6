import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

export const mockI18nUtility = (): any => {
  return {
    fromLocalAmount: jest.fn((amount: any) => {
      if (!amount) {
        return 0;
      }
      if (typeof amount !== 'string') {
        return amount;
      }
      const toBeConverted = amount
        .replace(new RegExp('.'.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '')
        .replace(new RegExp(','.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '.');
      return parseFloat(toBeConverted);
    }),

    fromLocalPercent: jest.fn((amount: any) => {
      if (!amount) {
        return 0;
      }
      if (typeof amount !== 'string') {
        return amount;
      }

      const toBeConverted = amount
        .replace(new RegExp('.'.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '')
        .replace(new RegExp(','.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '.');
      return parseFloat(toBeConverted);
    }),

    toLocalAmount: jest.fn((amount: number) => {
      registerLocaleData(localeDe, 'de-DE', localeDeExtra);
      if (isNaN(amount)) {
        return null;
      }

      return amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      // return decimalPipe.transform(amount, '1.2-2', 'de-DE');
    }),

    toLocalPercent: jest.fn((percent: number) => {
      registerLocaleData(localeDe, 'de-DE', localeDeExtra);
      if (!percent && percent !== 0) {
        return null;
      }
      return percent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 3 });
      // return decimalPipe.transform(percent, '1.1-3', 'de-DE');
    })
  };
};
