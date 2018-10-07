import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {UserData} from '../../models/user';
import * as fromAuth from '../actions/auth.actions';

export interface AuthState extends EntityState<UserData> {
  loading: boolean;
  loaded: boolean;
  error?: any;
}

export const authAdapter: EntityAdapter<UserData> = createEntityAdapter<UserData>({
  selectId: (user: UserData) => user.uid,
  sortComparer: (a: UserData, b: UserData) => a.email.localeCompare(b.email)
  });

const initialState: AuthState = authAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: undefined
});

export function authReducer(state: AuthState = initialState, action: fromAuth.AuthAction): AuthState {
  switch (action.type) {

    case fromAuth.QUERY_AUTH: {
      return {...state, loading: true, loaded: false, error: undefined};
    }

    case fromAuth.LOGIN: {
      return {...state, loading: true, loaded: false, error: undefined};
    }

    case fromAuth.AUTHENTICATED: {
      // console.log('authenticated: ', action.payload.displayName);
      return authAdapter.addOne(action.payload, {...state, loading: false, loaded: true, error: undefined});
    }

    case fromAuth.NOT_AUTHENTICATED: {
        return {...state, loading: false, loaded: false, error: action.payload};
    }

    case fromAuth.LOGOUT: {
      return authAdapter.removeAll({ ...state, loading: false, loaded: false });
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectAuthIds,
  selectEntities: selectAuthEntities,
  selectAll: selectAllAuth } = authAdapter.getSelectors();

export const selectAuthLoading = (state: AuthState) => state.loading;
export const selectAuthLoaded = (state: AuthState) => state.loaded;
export const selectCurrentAuth = (state: AuthState) => state.entities;
export const selectAuthError = (state: AuthState) => state.error;


