import {TestBed} from '@angular/core/testing';
import {UiService} from '../../shared/services/ui.service';
import {AuthService} from './auth.service';
import {MaterialModule} from '../../shared/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {cold} from 'jasmine-marbles';
import {UserCredentials} from '../models/user';
import {FbAuthService} from '../../shared/services/fb-auth.service';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {FbFunctionsService} from '../../shared/services/fb-functions.service';
import {mockFbAuthService, mockFbFunctionsService, mockFbStoreService} from '../../test/factories/mock-fb-services';
import {mockAuth} from '../../test/factories/mock-auth.factory';
import {mockSingleUser} from '../../test/factories/mock-users.factory';

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
    it(`should invoke FbAuthService.getAuthState, FBStoreService.getOneUserProfile, setIdToken 
    and return the current user's profile`, async () => {

      const spyGetAuthState = jest.spyOn(fbAuth, 'getAuthState');
      const spyGetOneUserProfile = jest.spyOn(fbStore, 'getOneUserProfile');
      const spySetIdToken = jest.spyOn<any, any>(service, 'setIdToken');

      const user = mockAuth()[0];
      const expected = cold('---b|', {b: user});
      await expect(service.queryAuth()).toBeObservable(expected);

      await expect(spyGetAuthState).toHaveBeenCalled();
      await expect(spySetIdToken).toHaveBeenCalled();
      return expect(spyGetOneUserProfile).toHaveBeenCalledWith(user.uid);
    });
  });

  describe('login', async () => {
    it('should invoke FbAuthService.signInWithEmailAndPassword and return true for a successful login', async () => {
      const credentials: UserCredentials = {
        email: 'tester@test.de',
        password: 'correct'
      };
      service.login(credentials);
      await expect(fbAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(credentials.email, credentials.password);
      const expected = cold('-a|', { a: true });
      return expect(service.login(credentials)).toBeObservable(expected);
    });

    it('should invoke FbAuthService.signInWithEmailAndPassword and return false for an unsuccessful login', async () => {
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
    it('should invoke FbAuthService.logout, removeIdToken and UiService.openSnackBar', async () => {
      const spyLogout = jest.spyOn(fbAuth, 'logout');
      // @ts-ignore
      const spyRemoveToken = jest.spyOn(service, 'removeIdToken');
      const spyOpenSnackBar = jest.spyOn(uiService, 'openSnackBar');
      const expected = cold('-a|', { a: true });
      await expect(service.logout()).toBeObservable(expected);
      await expect(spyLogout).toHaveBeenCalled();
      await expect(spyRemoveToken).toHaveBeenCalled();
      return expect(spyOpenSnackBar).toHaveBeenCalled();
    });
  });

  describe('changeMyPassword', async () => {
    it(`should invoke FbAuthService.changeMyPassword to change the current user's password`, async () => {
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
    it('should invoke FbFunctionsService.changePassword to change the password', async () => {
      const user = mockSingleUser();
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

  describe('getMessage', () => {
    it('should return a message content consisting of text and usage',  () => {
      const code = 'auth/wrong-password';
      const messageContent = service.getMessage(code);
      expect(messageContent).toEqual({
        text: 'Anmeldung ist fehlgeschlagen. Bitte überprüfen Sie ihre Eingaben.',
        usage: 'error'
      });
    });
  });

  describe('removeIdToken', () => {
    it('should invoke localStorage.removeItem', () => {
      const spy = jest.spyOn(localStorage, 'removeItem');
      // @ts-ignore
      service.removeIdToken();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setIdToken', () => {
    it('should invoke FbAuthService.getIdToken', () => {
      const spy = jest.spyOn(fbAuth, 'getIdToken');
      service['setIdToken']('anything');
      expect(spy).toHaveBeenCalled();
    });
  });
});
