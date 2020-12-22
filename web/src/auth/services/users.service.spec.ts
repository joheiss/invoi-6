import {TestBed} from '@angular/core/testing';
import {MaterialModule} from '../../shared/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {FbFunctionsService} from '../../shared/services/fb-functions.service';
import {mockFbFunctionsService, mockFbStoreService} from '../../test/factories/mock-fb-services';
import {UsersService} from './users.service';
import {mockSingleUser} from '../../test/factories/mock-users.factory';

describe('Users Service', () => {
  let fbStore: FbStoreService;
  let fbFunctions: FbFunctionsService;
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MaterialModule],
      providers: [
        { provide: FbStoreService, useValue: mockFbStoreService },
        { provide: FbFunctionsService, useValue: mockFbFunctionsService },
        UsersService
      ]
    });
    fbStore = TestBed.inject(FbStoreService);
    fbFunctions = TestBed.inject(FbFunctionsService);
    service = TestBed.inject(UsersService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create the service', () => {
    expect(service).toBeDefined();
  });

  describe('queryAll', async () => {
    it('should invoke the queryAllUsers method of the FireStore interface', async () => {

      const spy = jest.spyOn(fbStore, 'queryAllUsers');
      service.queryAll();
      return expect(spy).toHaveBeenCalled();
    });
  });

  describe('create', async () => {
    it('should invoke the createOneUser of the Google Cloud Functions interface', async () => {

      const spy = jest.spyOn(fbFunctions, 'createOneUser');
      const user = { ...mockSingleUser(), email: 'user@toBeCreated.test' };
      const password = 'SagIchNicht';
      const payload = { user, password };
      service.create(payload);
      return expect(spy).toHaveBeenCalledWith(payload);
    });
  });

  describe('delete', async () => {
    it('should invoke the deleteOneUser of the FireStore interface', async () => {

      const spy = jest.spyOn(fbStore, 'deleteOneUser');
      const payload = { ...mockSingleUser(), email: 'user@toBeDeleted.test', uid: 'toBeDeletedUid' };
      service.delete(payload);
      return expect(spy).toHaveBeenCalledWith(payload);
    });
  });

  describe('update', async () => {
    it('should invoke the updateOneUser of the Google Cloud Functions interface', async () => {

      const spy = jest.spyOn(fbFunctions, 'updateOneUser');
      const user = { ...mockSingleUser(), email: 'user@toBeDeleted.test', uid: 'toBeUpdatedUid' };
      const password = 'SagIchNicht';
      const payload = { user, password };
      service.update(payload);
      return expect(spy).toHaveBeenCalledWith(payload);
    });
  });

  describe('updateProfile', async () => {
    it('should invoke the updateOneUserProfile method of the FireStore interface', async () => {

      const spy = jest.spyOn(fbStore, 'updateOneUserProfile');
      const payload = { ...mockSingleUser(), roles: ['tester'], uid: 'toBeUpdatedUid' };
      service.updateProfile(payload);
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
});
