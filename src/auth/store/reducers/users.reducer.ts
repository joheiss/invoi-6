import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {UserData} from '../../models/user';
import * as fromUsers from '../actions/users.actions';

export interface UserState extends EntityState<UserData> {
  loading: boolean;
  loaded: boolean;
  error?: undefined;
}

export const userAdapter: EntityAdapter<UserData> = createEntityAdapter<UserData>({
  selectId: (user: UserData) => user.uid,
  sortComparer: (a: UserData, b: UserData) => a.email.localeCompare(b.email)
  });

const initialState: UserState = userAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: undefined
});

export function userReducer(state: UserState = initialState, action: fromUsers.UsersAction): UserState {
  switch (action.type) {

    case fromUsers.QUERY_USERS: {
      return { ...state, loading: true, loaded: false, error: undefined };
    }

    case fromUsers.ADDED_USER: {
      return userAdapter.addOne(action.payload, {...state, loaded: true, loading: false, error: undefined });
    }

    case fromUsers.MODIFIED_USER: {
      return userAdapter.updateOne({ id: action.payload.uid, changes: action.payload }, {...state, error: undefined });
    }

    case fromUsers.REMOVED_USER: {
      return userAdapter.removeOne(action.payload.uid, state);
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectUsersTotal} = userAdapter.getSelectors();

export const selectUsersLoading = (state: UserState) => state.loading;
export const selectUsersLoaded = (state: UserState) => state.loaded;
export const selectUsersError = (state: UserState) => state.error;


