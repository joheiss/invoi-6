import {mockAuthState} from './mock-auth-state.factory';
import {mockUsersState} from './mock-users-state.factory';


export const mockState = (): any => {
  return {
    routerReducer: {
      state: {
        url: '/users',
        params: {},
        queryParams: {}
      }
    },
    uiReducer: {
      isSpinning: true
    },
    auth: mockAuthState(),
    users: mockUsersState()
  };
};
