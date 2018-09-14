import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {GoodbyeComponent} from './goodbye/goodbye.component';
import {UsersComponent} from './users/users.component';
import {AuthenticationGuard, AuthorizationGuard, UsersGuard} from './guards';

const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'goodbye', component: GoodbyeComponent },
  { path: 'users', component: UsersComponent,
    canActivate: [AuthenticationGuard, AuthorizationGuard, UsersGuard],
    data: { roles: ['sys-admin'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(AUTH_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {
}
