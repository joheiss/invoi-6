import {NgModule} from '@angular/core';
import {AuthenticationGuard, AuthorizationGuard} from '../auth/guards';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ShellComponent} from './shell/shell.component';
import {AUTH_ROUTES} from '../auth/auth-routing.module';

const APP_ROUTES: Routes = [
  { path: '', component: ShellComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'invoicing',
        loadChildren: '../invoicing/invoicing.module#InvoicingModule',
        canLoad: [AuthenticationGuard, AuthorizationGuard],
        data: { roles: ['sales-user'] }
      },
      ...AUTH_ROUTES,
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, { paramsInheritanceStrategy: 'always', onSameUrlNavigation: 'reload'}) // , enableTracing: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
