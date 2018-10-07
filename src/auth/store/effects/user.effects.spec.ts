import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers';
import {UsersService, UsersUiService} from '../../services';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import {generateMoreUserProfiles, generateNewUser, generateUserProfile} from '../../../test/test-generators';
import {
  Authenticated, CreateUser, CreateUserFail, CreateUserSuccess,
  QueryAuth,
  QueryOneUser,
  QueryUsers,
  UpdateUser,
  UpdateUserFail,
  UpdateUserProfile, UpdateUserProfileFail, UpdateUserProfileSuccess,
  UpdateUserSuccess
} from '../actions';
import {UserEffects} from './user.effects';
import {Go, LeaveLogin, OpenSnackBar, StartSpinning, StopSpinning} from '../../../app/store/actions';

describe('User Effects', () => {

  let effects: UserEffects;
  let actions: Observable<any>;
  let store: Store<AppState>;
  let usersService: UsersService;
  let usersUiService: UsersUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        UserEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          }
        },
        {
          provide: UsersService,
          useValue: {
            queryAll: jest.fn(),
            queryOne: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            updateProfile: jest.fn(),
            getMessage: jest.fn()
          }
        },
        {
          provide: UsersUiService,
          useValue: {
            openPasswordChangePopup: jest.fn(),
            openUserProfilePopup: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.get(UserEffects);
    store = TestBed.get(Store);
    usersService = TestBed.get(UsersService);
    usersUiService = TestBed.get(UsersUiService);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should be created', async () => {
    return expect(effects).toBeTruthy();
  });

  describe('queryUsers$', () => {

    it('should return an array of user actions', async () => {
      const action = new QueryUsers();
      actions = hot('-a', {a: action});
      const users = generateMoreUserProfiles(3);
      const outcome = users.map(user => {
        const type = 'Added';
        const payload = { doc: { id: user.uid, data: jest.fn(() => user) } };
        return { type, payload };
      });
      const mapped = users.map(user => {
        const type = '[Auth] User Added';
        return { type, payload: user };
      });
      const expected = cold('--(cde)', { c: mapped[0], d: mapped[1], e: mapped[2] });
      usersService.queryAll = jest.fn(() => cold('-b|', {b: outcome}));
      return expect(effects.queryUsers$).toBeObservable(expected);
    });
  });

  describe('queryOneUser$', () => {

    it('should return a single user action', async () => {
      const user = generateUserProfile();
      const action = new QueryOneUser(user.uid);
      actions = hot('-a', {a: action});
      const outcome = [
        { type: 'Added', payload: { doc: { id: user.uid, data: jest.fn(() => user) } } }
      ];
      const mapped = { type: '[Auth] User Added', payload: user };
      const expected = cold('--c', { c: mapped });
      usersService.queryOne = jest.fn(() => cold('-b|', {b: outcome}));
      return expect(effects.queryOneUser$).toBeObservable(expected);
    });
  });

  describe('updateUser$', () => {

    it('should return an UpdateUserSuccess action and dispatch StartSpinning action', async () => {
      const user = generateUserProfile();
      const password = 'SagIchNicht';
      const action = new UpdateUser({ user, password });
      actions = hot('-a', {a: action});
      const outcome = new UpdateUserSuccess(user);
      const expected = cold('--c', {c: outcome});
      usersService.update = jest.fn(() => cold('-b|', {b: user}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateUser$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an UpdateUserFail action and dispatch StartSpinning action', async () => {
      const user = generateUserProfile();
      const password = 'NichtErlaubt';
      const action = new UpdateUser({ user, password });
      actions = hot('-a', {a: action});
      const error = new Error('Not allowed');
      const outcome = new UpdateUserFail(error);
      const expected = cold('--c', {c: outcome});
      usersService.update = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateUser$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('updateUserSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const user = generateUserProfile();
      const action = new UpdateUserSuccess(user);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', { a: new StopSpinning(), b: new OpenSnackBar({ message} ), c:  new Go({path: ['/users']}) });
      return expect(effects.updateUserSuccess$).toBeObservable(expected);
    });
  });

  describe('updateUserFail$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const error = new Error('Not allowed');
      const action = new UpdateUserFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', { a: new StopSpinning(), b: new OpenSnackBar({ message } ), c:  new Go({path: ['/users']}) });
      return expect(effects.updateUserFail$).toBeObservable(expected);
    });
  });

  describe('updateUserProfile$', () => {

    it('should return an UpdateUserProfileSuccess action and dispatch StartSpinning action', async () => {
      const user = generateUserProfile();
      const action = new UpdateUserProfile(user);
      actions = hot('-a', {a: action});
      const outcome = new UpdateUserProfileSuccess(user);
      const expected = cold('--c', {c: outcome});
      usersService.updateProfile = jest.fn(() => cold('-b|', {b: user}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateUserProfile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an UpdateUserProfileFail action and dispatch StartSpinning action', async () => {
      const user = generateUserProfile();
      const action = new UpdateUserProfile(user);
      actions = hot('-a', {a: action});
      const error = new Error('Failed');
      const outcome = new UpdateUserProfileFail(error);
      const expected = cold('--c', {c: outcome});
      usersService.updateProfile = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateUserProfile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('updateUserProfileSuccess$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar', async () => {
      const user = generateUserProfile();
      const action = new UpdateUserProfileSuccess(user);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', { a: new StopSpinning(), b: new OpenSnackBar({ message}) });
      return expect(effects.updateUserProfileSuccess$).toBeObservable(expected);
    });
  });

  describe('updateUserProfileFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar', async () => {
      const error = new Error('Failed');
      const action = new UpdateUserProfileFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', { a: new StopSpinning(), b: new OpenSnackBar({ message }) });
      return expect(effects.updateUserProfileFail$).toBeObservable(expected);
    });
  });

  describe('createUser$', () => {

    it('should return a CreateUserSuccessSuccess action and dispatch StartSpinning action', async () => {
      const user = generateNewUser();
      const password = 'SagIchNicht';
      const action = new CreateUser({user, password});
      actions = hot('-a', {a: action});
      const outcome = new CreateUserSuccess(user);
      const expected = cold('--c', {c: outcome});
      usersService.create = jest.fn(() => cold('-b|', {b: user}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createUser$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return a CreateUserFail action and dispatch StartSpinning action', async () => {
      const user = generateNewUser();
      const password = 'SagIchNicht';
      const action = new CreateUser({user, password});
      actions = hot('-a', {a: action});
      const error = new Error('Failed');
      const outcome = new CreateUserFail(error);
      const expected = cold('--c', {c: outcome});
      usersService.create = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createUser$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('createUserSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go', async () => {
      const user = generateUserProfile();
      const action = new CreateUserSuccess(user);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', { a: new StopSpinning(), b: new OpenSnackBar({ message}), c: new Go({path: ['/users']}) });
      return expect(effects.createUserSuccess$).toBeObservable(expected);
    });
  });

  describe('createUserFail$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go', async () => {
      const error = new Error('Failed');
      const action = new CreateUserFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', { a: new StopSpinning(), b: new OpenSnackBar({ message}), c: new Go({path: ['/users']}) });
      return expect(effects.createUserFail$).toBeObservable(expected);
    });
  });
});
