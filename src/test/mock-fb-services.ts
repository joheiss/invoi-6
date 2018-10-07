import {generateAuth, generateMoreUserProfiles, generateUserProfile} from './test-generators';
import {cold, hot} from 'jasmine-marbles';

export const mockFbAuthService: any = {
  changeMyPassword: jest.fn(() => cold('-a|', { a: true })),
  getAuthState: jest.fn(() => cold('-a|', { a: generateAuth() })),
  getIdToken: jest.fn(() => cold('-a|', { a: 'abcdefghijklmnopqrstuvwxyzäöü' })),
  logout: jest.fn(() => cold('-a|', { a: true })),
  signInWithEmailAndPassword: jest.fn((email, password) => {
    if (password === 'correct') {
      return cold('-a|', { a: true });
    }
    return cold('-a|', { a: false });
  }),
};

export const mockFbStoreService: any = {
  /* --- user profiles ---*/
  getOneUserProfile: jest.fn(() => cold('-a|', { a: {
    data: jest.fn(() => generateUserProfile())
  }})),
  queryAllUsers: jest.fn(() => hot('-a', { a: generateMoreUserProfiles() })),
  queryOneUser: jest.fn((uid: string) => cold('-b|', { b: { payload: { doc: { id: uid }}}})),
  deleteOneUser: jest.fn(() => cold('-b|', { b: generateUserProfile() })),
  updateOneUserProfile: jest.fn(() => cold('-b|', { b: generateUserProfile() })),
};

export const mockFbStorageService: any = {
  deleteFile: jest.fn(() => cold('-b|', {b: true})),
  downloadFile: jest.fn(() => cold('-b|', {b: 'download-url'})),
  getMetadata: jest.fn(() => cold('-b|', {b: 'metadata'})),
  updateMetadata: jest.fn(() => cold('-b|', {b: 'metadata'})),
  uploadFile: jest.fn(() => cold('-b|', {b: 'download-url'}))
};

export const mockFbFunctionsService: any = {
  /* --- auth ---*/
  changePassword: jest.fn((uid: string) => cold('-a|', { a: true })),
  /* --- users ---*/
  createOneUser: jest.fn(() => cold('-b|', { b: 'anything' })),
  updateOneUser: jest.fn(() => cold('-b|', { b: 'anything' }))
};
