import {cold, hot} from 'jasmine-marbles';
import {mockAuth} from './mock-auth.factory';
import {mockAllUsers, mockSingleUser} from './mock-users.factory';

export const mockFbAuthService: any = {
  changeMyPassword: jest.fn(() => cold('-a|', { a: true })),
  getAuthState: jest.fn(() => cold('-a|', { a: mockAuth()[0] })),
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
    data: jest.fn(() => mockSingleUser())
  }})),
  queryAllUsers: jest.fn(() => hot('-a', { a: mockAllUsers() })),
  queryOneUser: jest.fn((uid: string) => cold('-b|', { b: { payload: { doc: { id: uid }}}})),
  deleteOneUser: jest.fn(() => cold('-b|', { b: mockSingleUser() })),
  updateOneUserProfile: jest.fn(() => cold('-b|', { b: mockSingleUser() })),
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
  changePassword: jest.fn((_: string) => cold('-a|', { a: true })),
  /* --- users ---*/
  createOneUser: jest.fn(() => cold('-b|', { b: 'anything' })),
  updateOneUser: jest.fn(() => cold('-b|', { b: 'anything' }))
};
