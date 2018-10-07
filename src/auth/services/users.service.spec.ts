import {TestBed} from '@angular/core/testing';
import {MaterialModule} from '../../shared/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {generateUserProfile} from '../../test/test-generators';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {FbFunctionsService} from '../../shared/services/fb-functions.service';
import {mockFbFunctionsService, mockFbStoreService} from '../../test/mock-fb-services';
import {UsersService} from './users.service';

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
    fbStore = TestBed.get(FbStoreService);
    fbFunctions = TestBed.get(FbFunctionsService);
    service = TestBed.get(UsersService);

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
      const user = { ...generateUserProfile(), email: 'user@toBeCreated.test' };
      const password = 'SagIchNicht';
      const payload = { user, password };
      service.create(payload);
      return expect(spy).toHaveBeenCalledWith(payload);
    });
  });

  describe('delete', async () => {
    it('should invoke the deleteOneUser of the FireStore interface', async () => {

      const spy = jest.spyOn(fbStore, 'deleteOneUser');
      const payload = { ...generateUserProfile(), email: 'user@toBeDeleted.test', uid: 'toBeDeletedUid' };
      service.delete(payload);
      return expect(spy).toHaveBeenCalledWith(payload);
    });
  });

  describe('update', async () => {
    it('should invoke the updateOneUser of the Google Cloud Functions interface', async () => {

      const spy = jest.spyOn(fbFunctions, 'updateOneUser');
      const user = { ...generateUserProfile(), email: 'user@toBeDeleted.test', uid: 'toBeUpdatedUid' };
      const password = 'SagIchNicht';
      const payload = { user, password };
      service.update(payload);
      return expect(spy).toHaveBeenCalledWith(payload);
    });
  });

  describe('updateProfile', async () => {
    it('should invoke the updateOneUserProfile method of the FireStore interface', async () => {

      const spy = jest.spyOn(fbStore, 'updateOneUserProfile');
      const payload = { ...generateUserProfile(), roles: ['tester'], uid: 'toBeUpdatedUid' };
      service.updateProfile(payload);
      return expect(spy).toHaveBeenCalledWith(payload);
    });
  });

});
