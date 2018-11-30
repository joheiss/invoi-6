import {SettingsComponent} from './settings/settings.component';
import {CountryListComponent} from './country-list/country-list.component';
import {VatListComponent} from './vat-list/vat-list.component';
import {VatDetailsDialogComponent} from './vat-details-dialog/vat-details-dialog.component';
import {CountryDetailsDialogComponent} from './country-details-dialog/country-details-dialog.component';

export const containers: any[] = [
  SettingsComponent,
  CountryListComponent,
  CountryDetailsDialogComponent,
  VatListComponent,
  VatDetailsDialogComponent
];

export * from './settings/settings.component';
export * from './country-list/country-list.component';
export * from './vat-list/vat-list.component';
export * from './vat-details-dialog/vat-details-dialog.component';
export * from './country-details-dialog/country-details-dialog.component';
