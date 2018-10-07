import {of} from 'rxjs/index';
import {generateAuth} from './test-generators';

export const mockAngularFireAuth: any = {
  authState: of({ ...generateAuth(), getIdToken: jest.fn(() => Promise.resolve('abc')) }),
  auth: {
    signInWithEmailAndPassword: jest.fn((email, password) => {
      if (password === 'correct') {
        return Promise.resolve(true);
      } else {
        const err = new Error('login failed');
        return Promise.reject(err);
      }
    }),
    signOut: jest.fn(() => Promise.resolve(generateAuth()))
  }
};
