import {ActivatedRouteSnapshot, Params, RouterStateSnapshot} from '@angular/router';
import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import * as fromUi from './ui.reducer';
import * as fromAuth from '../../../auth/store/reducers/auth.reducer';
import * as fromUsers from '../../../auth/store/reducers/users.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  uiReducer: fromUi.UiState;
  auth: fromAuth.AuthState;
  users: fromUsers.UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  routerReducer: fromRouter.routerReducer,
  uiReducer: fromUi.uiReducer,
  auth: fromAuth.authReducer,
  users: fromUsers.userReducer
};

export const getAppState = createFeatureSelector<AppState>('');
export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('routerReducer');
export const getUiState = createFeatureSelector<fromUi.UiState>('uiReducer');

export class CustomSerializer implements fromRouter.RouterStateSerializer<RouterStateUrl> {

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;
    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params  } = state;
    return { url, queryParams, params };
  }
}
