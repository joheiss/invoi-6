import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CountryListComponent, SettingsComponent, VatListComponent} from './containers';
import {SettingsGuard} from './guards';

const ADMIN_ROUTES: Routes = [
  {
    path: 'settings',
    canActivate: [SettingsGuard],
    children: [
      { path: '', component: SettingsComponent,  canActivate: [SettingsGuard] },
      { path: 'countries', component: CountryListComponent, canActivate: [SettingsGuard] },
      { path: 'vats', component: VatListComponent, canActivate: [SettingsGuard] }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ADMIN_ROUTES)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    SettingsGuard
  ]
})
export class AdminRoutingModule {
}

