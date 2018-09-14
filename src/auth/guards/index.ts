import {AuthorizationGuard} from './authorization.guard';
import {AuthenticationGuard} from './authentication.guard';
import {UsersGuard} from './users.guard';

export const guards: any[] = [
  AuthenticationGuard,
  AuthorizationGuard,
  UsersGuard
];

export * from './authentication.guard';
export * from './authorization.guard';
export * from './users.guard';
