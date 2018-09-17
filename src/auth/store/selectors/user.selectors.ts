import * as fromRoot from '../../../app/store';
import * as fromUsers from '../reducers/users.reducer';

import {createSelector} from '@ngrx/store';
import {User} from '../../models/user';
import {selectUserState} from '../reducers';
import {selectAuth} from './auth.selectors';

export const selectUserIds = createSelector(
  selectUserState,
  fromUsers.selectUserIds
);

export const selectUserEntities = createSelector(
  selectUserState,
  fromUsers.selectUserEntities
);

export const selectAllUsers = createSelector(
  selectUserState,
  fromUsers.selectAllUsers
);

export const selectAllUsersAsObjArray = createSelector(
  selectAllUsers,
  users => users.map(user => User.createFromData(user))
);

export const selectUsersLoading = createSelector(
  selectUserState,
  fromUsers.selectUsersLoading
);

export const selectUsersLoaded = createSelector(
  selectUserState,
  fromUsers.selectUsersLoaded)
;

export const selectUsersTotal = createSelector(
  selectUserState,
  fromUsers.selectUsersTotal)
;

export const selectCurrentUser = createSelector(
  selectUserEntities,
  selectAuth,
  (entities, auth) => auth ? entities[auth.uid] : null
);

export const selectCurrentUserAsObj = createSelector(
  selectCurrentUser,
  user => user && User.createFromData(user)
);

export const selectUsersError = createSelector(
  selectUserState,
  fromUsers.selectUsersError
);

export const selectSelectedUser = createSelector(
  selectUserEntities,
  fromRoot.getRouterState,
  (entity, router) => router.state && entity[router.state.params.id]
);

export const selectSelectedUserAsObj = createSelector(
  selectSelectedUser,
  user => user && User.createFromData(user)
);

export const selectMoreThanOneUserLoaded = createSelector(
  selectUsersTotal,
  selectUsersLoaded,
  (total, loaded) => (loaded && total > 1)
);
