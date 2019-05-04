// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import 'zone.js/dist/zone-error';

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyApZubusyEwB_MjamNlHb-0OKFuTMxKKOg',
    authDomain: 'jovisco-invoicing.firebaseapp.com',
    databaseURL: 'https://jovisco-invoicing.firebaseio.com',
    projectId: 'jovisco-invoicing',
    storageBucket: 'jovisco-invoicing.appspot.com',
    messagingSenderId: '539994899339'
  },
  cloudFunctionsURL: 'https://us-central1-jovisco-invoicing.cloudfunctions.net',
  supportedLanguages: ['de', 'en'],
  logLevel: 0
};
