import {selectAllAuth, selectAuth, selectAuthLoading} from './auth.selectors';
import {mockState} from '../../../test/factories/mock-state';

describe('Auth Selectors', () => {

  const state = mockState();

  describe('selectAllAuth', () => {

    it('should return the authenticated user', () => {
      const expected = Object.keys(state.auth.entities).map(key => state.auth.entities[key]);
      expect(selectAllAuth(state)).toEqual(expected);
    });
  });

  describe('selectAuthLoading', () => {

    it('should return the current loading state', () => {
      const expected = false;
      expect(selectAuthLoading(state)).toEqual(expected);
    });
  });

  describe('selectAuth', () => {

    it('should return the current authenticated user', () => {
      const expected = Object.keys(state.auth.entities).map(key => state.auth.entities[key])[0];
      expect(selectAuth(state)).toEqual(expected);
    });
  });
});
