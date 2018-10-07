import {TestBed} from '@angular/core/testing';
import {UiService} from '../../shared/services/ui.service';
import {AuthService} from './auth.service';
import {MaterialModule} from '../../shared/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {generateUserProfile} from '../../test/test-generators';
import {cold} from 'jasmine-marbles';
import {UserCredentials} from '../models/user';
import {FbAuthService} from '../../shared/services/fb-auth.service';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {FbFunctionsService} from '../../shared/services/fb-functions.service';
import {mockFbAuthService, mockFbFunctionsService, mockFbStoreService} from '../../test/mock-fb-services';

describe('Auth Service', () => {
  let fbAuth: FbAuthService;
  let fbStore: FbStoreService;
  let fbFunctions: FbFunctionsService;
  let uiService: UiService;
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MaterialModule],
      providers: [
        { provide: FbAuthService, useValue: mockFbAuthService },
        { provide: FbStoreService, useValue: mockFbStoreService },
        { provide: FbFunctionsService, useValue: mockFbFunctionsService },
        UiService,
        AuthService
      ]
    });
    fbAuth = TestBed.get(FbAuthService);
    fbStore = TestBed.get(FbStoreService);
    fbFunctions = TestBed.get(FbFunctionsService);
    uiService = TestBed.get(UiService);
    service = TestBed.get(AuthService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create the service', () => {
    expect(service).toBeDefined();
  });

  describe('queryAuth', async () => {
    it('should provide the user profile of the currently logged in user', async () => {

      const spyGetAuthState = jest.spyOn(fbAuth, 'getAuthState');
      const spyGetOneUserProfile = jest.spyOn(fbStore, 'getOneUserProfile');
      // @ts-ignore
      const spySetIdToken = jest.spyOn(service, 'setIdToken');

      const user = generateUserProfile();
      const expected = cold('---b|', {b: user});
      await expect(service.queryAuth()).toBeObservable(expected);

      await expect(spyGetAuthState).toHaveBeenCalled();
      await expect(spySetIdToken).toHaveBeenCalled();
      return expect(spyGetOneUserProfile).toHaveBeenCalledWith(user.uid);
    });
  });

  describe('login', async () => {
    it('should return true in case of a successful login', async () => {
      const credentials: UserCredentials = {
        email: 'tester@test.de',
        password: 'correct'
      };
      service.login(credentials);
      await expect(fbAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(credentials.email, credentials.password);
      const expected = cold('-a|', { a: true });
      return expect(service.login(credentials)).toBeObservable(expected);
    });

    it('should throw an error in case of an unsuccessful login', async () => {
      const credentials: UserCredentials = {
        email: 'tester@test.de',
        password: 'incorrect'
      };
      const spySignIn = jest.spyOn(fbAuth, 'signInWithEmailAndPassword');
      service.login(credentials);
      await expect(spySignIn).toHaveBeenCalledWith(credentials.email, credentials.password);
      const expected = cold('-a|', { a: false });
      return expect(service.login(credentials)).toBeObservable(expected);
    });
  });

  describe('logout', async () => {
    it('should delete the token', async () => {
      const spyLogout = jest.spyOn(fbAuth, 'logout');
      const spyRemoveItem = jest.spyOn(localStorage, 'removeItem');
      const expected = cold('-a|', { a: true });
      await expect(service.logout()).toBeObservable(expected);
      await expect(spyLogout).toHaveBeenCalled();
      return expect(spyRemoveItem).toHaveBeenCalledWith('id_token');
    });
  });

  describe('changeMyPassword', async () => {
    it('should invoke the firebase method to change the password', async () => {
      const credentials = {
        uid: 'abcdefgh',
        email: 'tester@test.de',
        oldPassword: 'WeissIchNicht',
        password: 'SagIchNicht'
      };
      const spy = jest.spyOn(fbAuth, 'changeMyPassword');
      const expected = cold('-a|', { a: true });
      await expect(service.changeMyPassword(credentials)).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(credentials);
    });
  });

  describe('changePassword', async () => {
    it('should call the firebase endpoint to change the password', async () => {
      const user = generateUserProfile();
      const payload = {
        uid: user.uid,
        password: 'SagIchNicht'
      };
      const spy = jest.spyOn(fbFunctions, 'changePassword');
      const expected = cold('-a|', { a: true });
      await expect(service.changePassword(payload)).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(payload);
    });
  });
});
