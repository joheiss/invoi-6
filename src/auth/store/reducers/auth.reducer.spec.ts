import {authAdapter, authReducer, AuthState} from './auth.reducer';
import {Authenticated, Login, Logout, NotAuthenticated, QueryAuth} from '../actions';
import {generateUserProfile} from '../../../test/test-generators';

describe('Auth Reducer', () => {

  const initialState: AuthState = authAdapter.getInitialState({
    loading: false,
    loaded: false,
    error: undefined
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'Noop' } as any;
      const result = authReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('QueryAuth Action', () => {
    it('should toggle the loading state', () => {
      const action = new QueryAuth();
      const result = authReducer(undefined, action);
      expect(result).toEqual({...initialState, loading: true });
    });
  });

  describe('Login Action', () => {
    it('should toggle the loading state', () => {
      const action = new Login();
      const result = authReducer(undefined, action);
      expect(result).toEqual({...initialState, loading: true });
    });
  });

  describe('Authenticated Event', () => {
    it('should add the authenticated user and toggle loading / loaded in state', () => {
      const user = generateUserProfile();
      const action = new Authenticated(user);
      const result = authReducer(undefined, action);
      expect(result).toEqual({
        ...initialState,
        entities: { [user.uid]: user },
        ids: [user.uid],
        loading: false,
        loaded: true
      });
    });
  });

  describe('NotAuthenticated Event', () => {
    it('should keep the state as is, set error and toggle loaded', () => {
      const error = new Error('Authentication failed');
      const action = new NotAuthenticated(error);
      const result = authReducer(undefined, action);
      expect(result).toEqual({
        ...initialState,
        loading: false,
        loaded: false,
        error
      });
    });
  });

  describe('Logout Action', () => {
    it('should clear the state to initial State', () => {
      const user = generateUserProfile();
      const action = new Logout();
      const someState = {
        ...initialState,
        entities: { [user.uid]: user },
        ids: [user.uid],
        loading: false,
        loaded: true
      };
      const result = authReducer(someState, action);
      expect(result).toEqual(initialState);
    });
  });
});
