import {authAdapter, authReducer, AuthState} from './auth.reducer';
import {AddedUser, Authenticated, Login, Logout, ModifiedUser, NotAuthenticated, QueryAuth, QueryUsers, RemovedUser} from '../actions';
import {generateUserProfile} from '../../../test/test-generators';
import {userAdapter, userReducer, UserState} from './users.reducer';

describe('Users Reducer', () => {

  const initialState: UserState = userAdapter.getInitialState({
    loading: false,
    loaded: false,
    current: undefined,
    error: undefined
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'Noop' } as any;
      const result = userReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('QueryUsers Action', () => {
    it('should toggle the loading state', () => {
      const action = new QueryUsers();
      const result = userReducer(undefined, action);
      expect(result).toEqual({...initialState, loading: true });
    });
  });

  describe('AddedUser Event', () => {
    it('should toggle the loading state and add an user to the state', () => {
      const user = generateUserProfile();
      const action = new AddedUser(user);
      const result = userReducer(undefined, action);
      expect(result).toEqual({
        ...initialState,
        entities: { [user.uid]: user },
        ids: [user.uid],
        loading: false,
        loaded: true
      });
    });
  });

  describe('ModifiedUser Event', () => {
    it('should update the user in the state', () => {
      const user = generateUserProfile();
      const someState = {
        ...initialState,
        entities: { [user.uid]: user },
        ids: [user.uid],
        loading: false,
        loaded: true
      };
      const modifiedUser = { ...user, roles: ['sales-user', 'auditor'] };
      const action = new ModifiedUser(modifiedUser);
      const result = userReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: { [user.uid]: modifiedUser }
      });
    });
  });

  describe('RemovedUser Event', () => {
    it('should remove the user from the state', () => {
      const user = generateUserProfile();
      const someState = {
        ...initialState,
        entities: { [user.uid]: user },
        ids: [user.uid],
        loading: false,
        loaded: true
      };
      const action = new RemovedUser(user);
      const result = userReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: {},
        ids: []
      });
    });
  });

});
