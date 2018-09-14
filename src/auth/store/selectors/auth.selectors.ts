import {createSelector} from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducer';
import {selectAuthState} from '../reducers';

export const selectAllAuth = createSelector(
  selectAuthState,
  fromAuth.selectAllAuth
);

export const selectAuth = createSelector(
  selectAllAuth,
  (auth => auth.length > 0 ? auth[0] : null)
);