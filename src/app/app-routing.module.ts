import {NgModule} from '@angular/core';
import {AuthenticationGuard, AuthorizationGuard, UsersGuard} from '../auth/guards';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ShellComponent} from './shell/shell.component';
import {LoginComponent} from '../auth/login/login.component';
import {GoodbyeComponent} from '../auth/goodbye/goodbye.component';
import {UsersComponent} from '../auth/users/users.component';

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
      { path: 'login', component: LoginComponent },
      { path: 'goodbye', component: GoodbyeComponent },
      {
        path: 'users', component: UsersComponent,
        canActivate: [AuthenticationGuard, AuthorizationGuard, UsersGuard],
        data: { roles: ['sys-admin'] }
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, { paramsInheritanceStrategy: 'always'}) // , enableTracing: true })
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
