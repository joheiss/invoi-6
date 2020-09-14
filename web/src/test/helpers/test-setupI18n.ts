// @ts-ignore
const areIntlLocalesSupported = require('intl-locales-supported');

export function setupI18n(locales: string[]): void {
  // @ts-ignore
  if (global.Intl) {
    if (!areIntlLocalesSupported(locales)) {
      // @ts-ignore
      const IntlPolyfill = require('intl');
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    // @ts-ignore
    global.Intl = require('intl');
  }
}
