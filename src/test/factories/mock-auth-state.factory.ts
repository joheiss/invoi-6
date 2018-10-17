import {authAdapter, AuthState} from '../../auth/store/reducers/auth.reducer';
import {mockAuth} from './mock-auth.factory';

export const mockAuthState = (): AuthState => {
  const authState = authAdapter.getInitialState();
  return authAdapter.addOne(mockAuth()[0], {...authState, loading: false, loaded: true});
};
