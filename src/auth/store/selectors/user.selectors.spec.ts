import {mockState} from '../../../test/test-state';
import {
  selectAllUsers,
  selectAllUsersAsObjArray,
  selectCurrentUser,
  selectCurrentUserAsObj,
  selectMoreThanOneUserLoaded,
  selectSelectedUser,
  selectUserEntities,
  selectUsersLoaded
} from './user.selectors';
import {User} from '../../models/user';
import {generateMoreUserProfiles, generateUserProfile} from '../../../test/test-generators';

describe('User Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState;
  });

  describe('selectUserEntities', () => {

    it('should return the entities object containing 4 users', () => {
      expect(selectUserEntities(state)).toEqual(mockState.users.entities);
    });
  });

  describe('selectAllUsers', () => {

    it('should return an array containing all users', () => {
      const expected = Object.keys(mockState.users.entities).map(k => mockState.users.entities[k]);
      expect(selectAllUsers(state)).toEqual(expected);
    });
  });

  describe('selectAllUsersAsObjArray', () => {

    it('should return an array of user objects', () => {
      const expected = Object.keys(mockState.users.entities).map(key => User.createFromData(mockState.users.entities[key]));
      expect(selectAllUsersAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectUsersLoaded', () => {

    it('should return true ', () => {
      const expected = mockState.users.loaded;
      expect(selectUsersLoaded(state)).toEqual(expected);
    });
  });

  describe('selectCurrentUser', () => {

    it('should return the currently logged in user ', () => {
      const expected = generateUserProfile();
      expect(selectCurrentUser(state)).toEqual(expected);
    });
  });

  describe('selectCurrentUserAsObj', () => {

    it('should return the currently logged in user as object', () => {
      const expected = User.createFromData(generateUserProfile());
      expect(selectCurrentUserAsObj(state)).toEqual(expected);
    });
  });

  describe('selectSelectedUser', () => {

    it('should return the currently selected user', () => {
      const users = generateMoreUserProfiles(3);
      state.routerReducer.state = { url: '/users', params: { id: users[1].uid } } as any;
      const expected = users[1];
      expect(selectSelectedUser(state)).toEqual(expected);
    });
  });

  describe('selectMoreThanOneUserLoaded', () => {

    it('should return true', () => {
      expect(selectMoreThanOneUserLoaded(state)).toBeTruthy();
    });
  });
});
