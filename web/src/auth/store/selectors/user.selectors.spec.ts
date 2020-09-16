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
import {mockState} from '../../../test/factories/mock-state';
import {mockAllUsers, mockSingleUser} from '../../../test/factories/mock-users.factory';
import {UserFactory} from 'jovisco-domain/';

describe('User Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState();
  });

  describe('selectUserEntities', () => {

    it('should return the entities object containing 4 users', () => {
      expect(selectUserEntities(state)).toEqual(state.users.entities);
    });
  });

  describe('selectAllUsers', () => {

    it('should return an array containing all users', () => {
      const expected = Object.keys(state.users.entities).map(k => state.users.entities[k]);
      expect(selectAllUsers(state)).toEqual(expected);
    });
  });

  describe('selectAllUsersAsObjArray', () => {

    it('should return an array of user objects', () => {
      const expected = UserFactory.fromEntity(state.users.entities);
      expect(selectAllUsersAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectUsersLoaded', () => {

    it('should return true ', () => {
      const expected = state.users.loaded;
      expect(selectUsersLoaded(state)).toEqual(expected);
    });
  });

  describe('selectCurrentUser', () => {

    it('should return the currently logged in user ', () => {
      const expected = mockSingleUser();
      expect(selectCurrentUser(state)).toEqual(expected);
    });
  });

  describe('selectCurrentUserAsObj', () => {

    it('should return the currently logged in user as object', () => {
      const expected = UserFactory.fromData(mockSingleUser());
      expect(selectCurrentUserAsObj(state)).toEqual(expected);
    });
  });

  describe('selectSelectedUser', () => {

    it('should return the currently selected user', () => {
      const users = mockAllUsers();
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
