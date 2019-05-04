import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import * as fromContainers from './containers';
import {CountryDetailsDialogComponent, VatDetailsDialogComponent} from './containers';
import {AdminRoutingModule} from './admin-routing.module';
import {businessServices} from './business-services';
import {services} from './services';
import {guards} from './guards';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [
    ...fromContainers.containers,
  ],
  providers: [
    ...businessServices,
    ...services,
    ...guards
  ],
    entryComponents: [
    CountryDetailsDialogComponent,
    VatDetailsDialogComponent
  ]
})
export class AdminModule { }
