import {AuthService} from './auth.service';
import {UsersService} from './users.service';
import {UsersUiService} from './users-ui.service';

export const services: any[] = [
  AuthService,
  UsersService,
  UsersUiService
];

export * from './auth.service';
export *  from './users.service';
export * from './users-ui.service';
