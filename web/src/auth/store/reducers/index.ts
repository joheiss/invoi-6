import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import * as fromUser from './users.reducer';

export interface IdState {
  auth: fromAuth.AuthState;
  users: fromUser.UserState;
}

export const reducers: ActionReducerMap<IdState> = {
  auth: fromAuth.authReducer,
  users: fromUser.userReducer
};

export const selectAuthState = createFeatureSelector<fromAuth.AuthState>('auth');
export const selectUserState = createFeatureSelector<fromUser.UserState>('users');
