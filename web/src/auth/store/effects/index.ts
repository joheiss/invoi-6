import {AuthEffects} from './auth.effects';
import {UserEffects} from './user.effects';

export const authEffects: any[] = [
  AuthEffects,
  UserEffects
];

export * from './auth.effects';
export * from './user.effects';
