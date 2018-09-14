import {NgModule} from '@angular/core';
import {AuthenticationGuard, AuthorizationGuard} from '../auth/guards';
import {LoadComponent} from './load/load.component';
import {TestComponent} from './test/test.component';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';

const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'invoicing',
    loadChildren: '../invoicing/invoicing.module#InvoicingModule',
    canLoad: [AuthenticationGuard, AuthorizationGuard],
    data: { roles: ['sales-user'] }
  },
  { path: 'test', component: TestComponent },
  { path: 'load', component: LoadComponent },
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, { paramsInheritanceStrategy: 'always' })  // , { enableTracing: true }
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthenticationGuard,
    AuthorizationGuard
  ]
})
export class AppRoutingModule {}
