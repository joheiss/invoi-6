import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import * as fromContainers from './containers';
import {CountryDetailsDialogComponent, VatDetailsDialogComponent} from './containers';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    ...fromContainers.containers,
  ],
  entryComponents: [
    CountryDetailsDialogComponent,
    VatDetailsDialogComponent
  ]
})
export class AdminModule { }
