import {of} from 'rxjs/index';
import {mockAuth} from '../factories/mock-auth.factory';

export const mockAngularFireAuth: any = {
  authState: of({ ...mockAuth()[0], getIdToken: jest.fn(() => Promise.resolve('abc')) }),
  auth: {
    signInWithEmailAndPassword: jest.fn((email, password) => {
      if (password === 'correct') {
        return Promise.resolve(true);
      } else {
        const err = new Error('login failed');
        return Promise.reject(err);
      }
    }),
    signOut: jest.fn(() => Promise.resolve(mockAuth()[0]))
  }
};
