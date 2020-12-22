import {UsersBusinessService} from './users-business.service';
import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {IdState} from '../store';
import {cold} from 'jasmine-marbles';
import {ChangeMyPassword, ChangePassword, CreateUser, QueryUsers, UpdateUser, UpdateUserProfile} from '../store';
import {DeleteFile, UploadImage} from '../../storage/store';
import {UploadPopupData} from '../../storage/models/upload-popup-data';
import {mockSingleUser} from '../../test/factories/mock-users.factory';
import {mockAuth} from '../../test/factories/mock-auth.factory';
import {of} from 'rxjs/internal/observable/of';
import {User, UserProfileData} from 'jovisco-domain';
import {UserFactory} from 'jovisco-domain/dist/user/user-factory';

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
    store = TestBed.inject(Store);
    service = TestBed.inject(UsersBusinessService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    userData = mockSingleUser();
    user = UserFactory.fromData(userData);
    service['auth'] = mockAuth()[0];
  });

  it('should create the service', () => {
    expect(service).toBeDefined();
    expect(store.pipe).toHaveBeenCalled();
  });

  it('should retrieve correct auth data during construction', done => {
    of(mockAuth(['sales-user'])).pipe(
    ).subscribe(auth => {
      expect(auth[0]).toBeTruthy();
      expect(auth[0].uid).toEqual('991OyAr37pNsS8BGHzidmOGAGVX2');
      expect(auth[0].isLocked).toBeFalsy();
      done();
    });
  });

  it('should invoke store selector if getAllUsers is processed', () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getAllUsers();
    expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if getCurrent is processed', () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getCurrent();
    expect(spy).toHaveBeenCalled();
  });

  describe('changePassword', () => {
    it('should dispatch ChangeMyPassword action if logged in user equals requested user', () => {
      const credentials = {
        uid: user.uid,
        email: user.email,
        oldPassword: 'sagIchNicht',
        password: 'weissIchNicht'
      };
      const spy = jest.spyOn(store, 'dispatch');
      const action = new ChangeMyPassword(credentials);
      service.changePassword(credentials);
     expect(spy).toHaveBeenCalledWith(action);
    });

    it('should dispatch ChangePassword action if logged in user is not requested user', () => {
      const credentials = {
        uid: 'IchNicht',
        password: 'weissIchAuchNicht'
      };
      const spy = jest.spyOn(store, 'dispatch');
      const action = new ChangePassword(credentials);
      service.changePassword(credentials);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('create', () => {
    it('should dispatch CreateUser action', () => {
      const userData = mockSingleUser();
      userData.displayName = 'New User';
      userData.email = 'new.user@test.de';
      userData.phoneNumber = `${userData.phoneNumber}111`;
      userData.uid = undefined;
      userData.roles = ['auditor'];
      const user = UserFactory.fromData(userData);
      const password = 'SagIchNicht';
      service.create({ user, password });
      const payload = { user: userData, password: password };
      const spy = jest.spyOn(store, 'dispatch');
      const action = new CreateUser(payload);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('deleteProfileImage', () => {
    it('should dispatch DeleteFile and UpdateUser actions', () => {
      const userData = { ...mockSingleUser(), imageUrl: 'http://abc.defghijk.lmo/images/users/1234' };
      const user = UserFactory.fromData(userData);
      service.deleteProfileImage(user);
      const filePath = 'images/users/1234';
      const spy = jest.spyOn(store, 'dispatch');
      const action1 = new DeleteFile(filePath);
      expect(spy).toHaveBeenCalledWith(action1);
      const payload = {user: { ...userData, imageUrl: null }, password: null };
      const action2 = new UpdateUser(payload);
      expect(spy).toHaveBeenCalledWith(action2);
    });
  });

  describe('getThumbnailUrlForSize', () => {
    it('should return correct URL for given size', () => {
      const url = 'http://abc.defghijk.lmo/images/users/1234/image_64_thumb.png';
      const size = '99';
      const expected = 'http://abc.defghijk.lmo/images/users/1234/image_99_thumb.png';
      expect(service.getThumbnailUrlForSize(url, size)).toEqual(expected);
    });
  });

  describe('new', () => {
    it('should return user template', () => {
      const expected: any = {
        roles: [],
        isLocked: false
      };
      expect(service.new()).toEqual(expected);
    });
  });

  describe('query', () => {
    it('should dispatch QueryUser action', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const action = new QueryUsers();
      service.query();
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  it('should invoke store selector if select is processed', () => {
    const spy = jest.spyOn(store, 'pipe');
    service.select();
    expect(spy).toHaveBeenCalled();
  });

  describe('update', () => {
    it('should dispatch UpdateUser action', () => {
      const password = 'SagIchNicht';
      const payload = { user: userData, password: password };
      const spy = jest.spyOn(store, 'dispatch');
      const action = new UpdateUser(payload);
      service.update({ user, password });
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('update', () => {
    it('should dispatch UpdateProfile action', () => {
      const payload = userData;
      const spy = jest.spyOn(store, 'dispatch');
      const action = new UpdateUserProfile(payload);
      service.updateProfile(user);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('uploadProfileImage', () => {
    it('should dispatch UploadImage action', () => {
      const payload: UploadPopupData = {
        title: 'Profilbild hochladen',
        selectButtonCaption: 'Bild auswählen',
        filePath: `images/users/${user.uid}`
      };
      const spy = jest.spyOn(store, 'dispatch');
      const action = new UploadImage(payload);
      service.uploadProfileImage(user);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('getImagePathFromUrl', () => {
    it('should return image path from image url', () => {
      const imageUrl = 'http://abc.defghijk.lmo/images/users/1234';
      const expected = 'images/users/1234';
      expect(service['getImagePathFromUrl'](imageUrl)).toEqual(expected);
    });
  });
});
