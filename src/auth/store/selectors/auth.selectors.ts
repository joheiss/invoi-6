import {createSelector} from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducer';
import {selectAuthState} from '../reducers';

export const selectAllAuth = createSelector(
  selectAuthState,
  fromAuth.selectAllAuth
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  fromAuth.selectAuthLoading
);

export const selectAuth = createSelector(
  selectAllAuth,
  auth => auth && auth.length > 0 ? auth[0] : null
);

export const selectRoles = createSelector(
  selectAuth,
  auth => auth ? auth.roles : []
);

export const selectIsSalesUser = createSelector(
  selectRoles,
  roles => roles.indexOf('sales-user') > 0
);

export const selectIsSysAdmin = createSelector(
  selectRoles,
  roles => roles.indexOf('sys-admin') > 0
);
