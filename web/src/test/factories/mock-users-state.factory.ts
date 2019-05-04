import {userAdapter, UserState} from '../../auth/store/reducers/users.reducer';
import {mockAllUsers, mockSingleUser} from './mock-users.factory';

export const mockUsersState = (): UserState => {
  const userState = userAdapter.getInitialState();
  return userAdapter.addMany(mockAllUsers(), {...userState, loading: false, loaded: true});
};

export const mockUsersStateWithOnlyAuthUser = (): UserState => {
  const userState = userAdapter.getInitialState();
  return userAdapter.addOne(mockSingleUser(), {...userState, loading: false, loaded: true});
};

