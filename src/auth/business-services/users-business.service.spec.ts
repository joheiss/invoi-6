import {UsersBusinessService} from './users-business.service';
import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {IdState} from '../store/reducers';
import {cold} from 'jasmine-marbles';
import {User, UserProfileData} from '../models/user';
import {ChangeMyPassword, ChangePassword, CreateUser, QueryUsers, UpdateUser, UpdateUserProfile} from '../store/actions';
import {DeleteFile, UploadImage} from '../../storage/store/actions';
import {UploadPopupData} from '../../storage/models/upload-popup-data';
import {mockAllUsers, mockSingleUser} from '../../test/factories/mock-users.factory';
import {mockAuth} from '../../test/factories/mock-auth.factory';

describe('Users Business Service', () => {
  let store: Store<IdState>;
  let service: UsersBusinessService;
  const auth = mockAuth()[0];
  let userData: UserProfileData;
  let user: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => cold('-a|', { a: auth }))
          }
        },
        UsersBusinessService
      ]
    });
    store = TestBed.get(Store);
    service = TestBed.get(UsersBusinessService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    userData = mockSingleUser();
    user = User.createFromData(userData);
    service['auth'] = mockAuth()[0];
  });

  it('should create the service', () => {
    expect(service).toBeDefined();
    expect(store.pipe).toHaveBeenCalled();
  });

  describe('getAllUsers', () => {
    it('should return all users as User objects', async() => {
      const allUsers = mockAllUsers().map(user => User.createFromData(user));
      const expected = cold('-b|', { b: allUsers });
      store.pipe = jest.fn(() => expected);
      await expect(service.getAllUsers()).toBeObservable(expected);
      return expect(store.pipe).toHaveBeenCalled();
    });
  });

  describe('getCurrent', () => {
    it('should return current user as User objects', async() => {
      const expected = cold('-b|', { b: user });
      store.pipe = jest.fn(() => expected);
      await expect(service.getCurrent()).toBeObservable(expected);
      return expect(store.pipe).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should dispatch ChangeMyPassword action if logged in user equals requested user', async() => {
      const credentials = {
        uid: user.uid,
        email: user.email,
        oldPassword: 'sagIchNicht',
        password: 'weissIchNicht'
      };
      await expect(service.changePassword(credentials)).not.toBe(true);
      const spy = jest.spyOn(store, 'dispatch');
      const action = new ChangeMyPassword(credentials);
      return expect(spy).toHaveBeenCalledWith(action);
    });

    it('should dispatch ChangePassword action if logged in user is not requested user', async() => {
      const credentials = {
        uid: 'IchNicht',
        password: 'weissIchAuchNicht'
      };
      await expect(service.changePassword(credentials)).not.toBe(true);
      const spy = jest.spyOn(store, 'dispatch');
      const action = new ChangePassword(credentials);
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('create', () => {
    it('should dispatch CreateUser action', async() => {
      const userData = mockSingleUser();
      userData.displayName = 'New User';
      userData.email = 'new.user@test.de';
      userData.phoneNumber = `${userData.phoneNumber}111`;
      userData.uid = undefined;
      userData.roles = ['auditor'];
      const user = User.createFromData(userData);
      const password = 'SagIchNicht';
      await expect(service.create({ user, password })).not.toBe(true);
      const payload = { user: userData, password: password };
      const spy = jest.spyOn(store, 'dispatch');
      const action = new CreateUser(payload);
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('deleteProfileImage', () => {
    it('should dispatch DeleteFile and UpdateUser actions', async() => {
      const userData = { ...mockSingleUser(), imageUrl: 'http://abc.defghijk.lmo/images/users/1234' };
      const user = User.createFromData(userData);
      await expect(service.deleteProfileImage(user)).not.toBe(true);
      const filePath = 'images/users/1234';
      const spy = jest.spyOn(store, 'dispatch');
      const action1 = new DeleteFile(filePath);
      await expect(spy).toHaveBeenCalledWith(action1);
      const payload = {user: { ...userData, imageUrl: null }, password: null };
      const action2 = new UpdateUser(payload);
      return expect(spy).toHaveBeenCalledWith(action2);
    });
  });

  describe('getThumbnailUrlForSize', () => {
    it('should return correct URL for given size', async() => {
      const url = 'http://abc.defghijk.lmo/images/users/1234/image_64_thumb.png';
      const size = '99';
      const expected = 'http://abc.defghijk.lmo/images/users/1234/image_99_thumb.png';
      return expect(service.getThumbnailUrlForSize(url, size)).toEqual(expected);
    });
  });

  describe('new', () => {
    it('should return user template', async() => {
      const expected: UserProfileData = {
        uid: null,
        email: null,
        organization: null,
        roles: null,
        displayName: null,
        isLocked: false
      };
      return expect(service.new()).toEqual(expected);
    });
  });

  describe('query', () => {
    it('should dispatch QueryUser action', async() => {
      await expect(service.query()).not.toBe(true);
      const spy = jest.spyOn(store, 'dispatch');
      const action = new QueryUsers();
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('select', () => {
    it('should return the selected user', async() => {
      const expected = cold('-b|', { b: user });
      store.pipe = jest.fn(() => expected);
      await expect(service.select()).toBeObservable(expected);
      return expect(store.pipe).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should dispatch UpdateUser action', async() => {
      const password = 'SagIchNicht';
      await expect(service.update({ user, password })).not.toBe(true);
      const payload = { user: userData, password: password };
      const spy = jest.spyOn(store, 'dispatch');
      const action = new UpdateUser(payload);
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('update', () => {
    it('should dispatch UpdateProfile action', async() => {
      await expect(service.updateProfile(user)).not.toBe(true);
      const payload = userData;
      const spy = jest.spyOn(store, 'dispatch');
      const action = new UpdateUserProfile(payload);
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('uploadProfileImage', () => {
    it('should dispatch UploadImage action', async() => {
      const payload: UploadPopupData = {
        title: 'Profilbild hochladen',
        selectButtonCaption: 'Bild auswählen',
        filePath: `images/users/${user.uid}`
      };
      await expect(service.uploadProfileImage(user)).not.toBe(true);
      const spy = jest.spyOn(store, 'dispatch');
      const action = new UploadImage(payload);
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('getImagePathFromUrl', () => {
    it('should return image path from image url', async() => {
      const imageUrl = 'http://abc.defghijk.lmo/images/users/1234';
      const expected = 'images/users/1234';
      // @ts-ignore
      return expect(service.getImagePathFromUrl(imageUrl)).toEqual(expected);
    });
  });
});
