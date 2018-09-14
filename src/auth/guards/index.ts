import {AuthorizationGuard} from './authorization.guard';
import {Router} from '@angular/router';
import {AuthenticationGuard} from './authentication.guard';
import {Store} from '@ngrx/store';
import {AppState} from '../../app/store/reducers';
import {UsersGuard} from './users.guard';

export const guards: any[] = [
  AuthenticationGuard,
  AuthorizationGuard,
  UsersGuard
];

export * from './authentication.guard';
export * from './authorization.guard';
export * from './users.guard';
