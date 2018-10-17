import {AuthEffects} from './auth.effects';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable} from 'rxjs/index';
import {TestBed} from '@angular/core/testing';
import {AuthService} from '../../services';
import {Store} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {ROOT_EFFECTS_INIT} from '@ngrx/effects';
import {
  Authenticated,
  ChangeMyPassword,
  ChangeMyPasswordFail,
  ChangeMyPasswordSuccess,
  ChangePassword,
  ChangePasswordFail,
  ChangePasswordSuccess,
  Login,
  Logout,
  NotAuthenticated,
  QueryAuth,
  QueryOneUser
} from '../actions';
import {AppState} from '../../../app/store/reducers';
import {Go, LeaveLogin, OpenSnackBar, StartSpinning, StopSpinning} from '../../../app/store/actions';
import {ClearState} from '../../../invoicing/store/actions';
import {mockSingleUser} from '../../../test/factories/mock-users.factory';

describe('Auth Effects', () => {

  let effects: AuthEffects;
  let actions: Observable<any>;
  let store: Store<AppState>;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          }
        },
        {
          provide: AuthService,
          useValue: {
            queryAll: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            changeMyPassword: jest.fn(),
            changePassword: jest.fn(),
            getMessage: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.get(AuthEffects);
    store = TestBed.get(Store);
    authService = TestBed.get(AuthService);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should be created', async () => {
    return expect(effects).toBeTruthy();
  });

  describe('initAuth$', () => {

    it('should return an Authenticated action, with the user profile', async () => {
      const action = {type: ROOT_EFFECTS_INIT};
      actions = hot('-a', {a: action});
      const user = mockSingleUser();
      const outcome = new Authenticated(user);
      const expected = cold('--c', {c: outcome});
      authService.queryAuth = jest.fn(() => cold('-b|', {b: user}));
      return expect(effects.initAuth$).toBeObservable(expected);
    });

    it('should return a NotAuthenticated action, with an error', async () => {
      const action = {type: ROOT_EFFECTS_INIT};
      actions = hot('-a', {a: action});
      const error = new Error('Not Authenticated');
      const outcome = new NotAuthenticated(error);
      const expected = cold('--c', {c: outcome});
      authService.queryAuth = jest.fn(() => cold('-#|', {}, error));
      return expect(effects.initAuth$).toBeObservable(expected);
    });
  });

  describe('queryAuth$', () => {

    it('should return an Authenticated action, with the user profile', async () => {
      const action = new QueryAuth();
      actions = hot('-a', {a: action});
      const user = mockSingleUser();
      const outcome = new Authenticated(user);
      const expected = cold('--c', {c: outcome});
      authService.queryAuth = jest.fn(() => cold('-b|', {b: user}));
      return expect(effects.queryAuth$).toBeObservable(expected);
    });

    it('should return a NotAuthenticated action, with an error', async () => {
      const action = new QueryAuth();
      actions = hot('-a', {a: action});
      const error = new Error('Not Authenticated');
      const outcome = new NotAuthenticated(error);
      const expected = cold('--c', {c: outcome});
      authService.queryAuth = jest.fn(() => cold('-#|', {}, error));
      return expect(effects.queryAuth$).toBeObservable(expected);
    });
  });

  describe('login$', () => {

    it('should return a QueryAuth action, and dispatch the StartSpinning action', async () => {
      const credentials = {email: 'tester@test.de', password: 'correct '};
      const action = new Login(credentials);
      actions = hot('-a', {a: action});
      const outcome = new QueryAuth();
      const expected = cold('--c', {c: outcome});
      authService.login = jest.fn(() => cold('-b|', {b: true}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.login$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return a NotAuthenticated action, and dispatch the StartSpinning action', async () => {
      const credentials = {email: 'tester@test.de', password: 'incorrect '};
      const action = new Login(credentials);
      actions = hot('-a', {a: action});
      const error = new Error('Not Authenticated');
      const outcome = new NotAuthenticated(error);
      const expected = cold('--c', {c: outcome});
      authService.login = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.login$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('logout$', () => {

    it('should return a ClearState action', async () => {
      const action = new Logout();
      actions = hot('-a', {a: action});
      const outcome = new ClearState();
      const expected = cold('--c', {c: outcome});
      authService.logout = jest.fn(() => cold('-b|', {b: true}));
      return expect(effects.logout$).toBeObservable(expected);
    });
  });

  describe('authenticated$', () => {

    it('should return an array of actions containing QueryOneUser, StopSpinning and LeaveLogin action', async () => {
      const user = mockSingleUser();
      const action = new Authenticated(user);
      actions = hot('-a', {a: action});
      const expected = cold('-(abc)', { a: new QueryOneUser(user.uid), b: new StopSpinning(), c:  new LeaveLogin(user) });
      return expect(effects.authenticated$).toBeObservable(expected);
    });
  });

  describe('notAuthenticated$', () => {

    it('should return an array of actions containing Go and StopSpinning', async () => {
      const action = new NotAuthenticated();
      actions = hot('-a', {a: action});
      const expected = cold('-(ab)', { a: new Go({path: ['/login']}), b: new StopSpinning() });
      return expect(effects.notAuthenticated$).toBeObservable(expected);
    });
  });

  describe('changeMyPassword$', () => {

    it('should return a ChangeMyPasswordSuccess action, and dispatch the StartSpinning action', async () => {
      const credentials = { uid: 'tester-uid', email: 'tester@test.de', oldPassword: 'correct', password: 'SagIchNicht' };
      const action = new ChangeMyPassword(credentials);
      actions = hot('-a', {a: action});
      const outcome = new ChangeMyPasswordSuccess();
      const expected = cold('--c', {c: outcome});
      authService.changeMyPassword = jest.fn(() => cold('-b|', {b: true}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.changeMyPassword$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return a ChangeMyPasswordFail action, and dispatch the StartSpinning action', async () => {
      const credentials = { uid: 'tester-uid', email: 'tester@test.de', oldPassword: 'correct', password: 'NichtErlaubt' };
      const action = new ChangeMyPassword(credentials);
      actions = hot('-a', {a: action});
      const error = new Error('Not Allowed');
      const outcome = new ChangeMyPasswordFail(error);
      const expected = cold('--c', {c: outcome});
      authService.changeMyPassword = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.changeMyPassword$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('changeMyPasswordSuccess$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar', async () => {
      const action = new ChangeMyPasswordSuccess();
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', { a: new StopSpinning(), b: new OpenSnackBar({ message }) });
      return expect(effects.changeMyPasswordSuccess$).toBeObservable(expected);
    });
  });

  describe('changeMyPasswordFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar', async () => {
      const error = new Error('Change my password failed');
      const action = new ChangeMyPasswordFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', { a: new StopSpinning(), b: new OpenSnackBar({ message }) });
      return expect(effects.changeMyPasswordFail$).toBeObservable(expected);
    });
  });

  describe('changePassword$', () => {

    it('should return a ChangePasswordSuccess action, and dispatch the StartSpinning action', async () => {
      const credentials = { uid: 'other-uid', password: 'SagIchNicht' };
      const action = new ChangePassword(credentials);
      actions = hot('-a', {a: action});
      const outcome = new ChangePasswordSuccess();
      const expected = cold('--c', {c: outcome});
      authService.changePassword = jest.fn(() => cold('-b|', {b: true}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.changePassword$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return a ChangePasswordFail action, and dispatch the StartSpinning action', async () => {
      const credentials = { uid: 'other-uid', password: 'NichtErlaubt' };
      const action = new ChangePassword(credentials);
      actions = hot('-a', {a: action});
      const error = new Error('Not Allowed');
      const outcome = new ChangePasswordFail(error);
      const expected = cold('--c', {c: outcome});
      authService.changePassword = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.changePassword$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('changePasswordSuccess$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar', async () => {
      const action = new ChangePasswordSuccess();
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', { a: new StopSpinning(), b: new OpenSnackBar({ message }) });
      return expect(effects.changePasswordSuccess$).toBeObservable(expected);
    });
  });

  describe('changePasswordFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar', async () => {
      const error = new Error('Change password failed');
      const action = new ChangePasswordFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', { a: new StopSpinning(), b: new OpenSnackBar({ message }) });
      return expect(effects.changePasswordFail$).toBeObservable(expected);
    });
  });
});
