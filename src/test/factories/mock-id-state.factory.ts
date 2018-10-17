import {IdState} from '../../auth/store/reducers';
import {mockAuthState} from './mock-auth-state.factory';
import {mockUsersState, mockUsersStateWithOnlyAuthUser} from './mock-users-state.factory';

export const mockIdState = (): IdState => {
  return {
    auth: mockAuthState(),
    users: mockUsersState()
  };
};

export const mockIdStateWithOnlyAuthUser = (): IdState => {
  return {
    auth: mockAuthState(),
    users: mockUsersStateWithOnlyAuthUser()
  };
};
