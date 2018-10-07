import {generateMoreUserProfiles, generateUserProfile} from './test-generators';
import {UserProfileData} from '../auth/models/user';

const user: UserProfileData = generateUserProfile();
const users: UserProfileData[] = [generateUserProfile(), ...generateMoreUserProfiles(3)];
const userIds = users.map(u => u.uid);
const userEntities = {};
users.map(u => userEntities[u.uid] = u);

export const mockState = {
  routerReducer: {
    state: {
      url: '/users',
      params: {},
      queryParams: {}
    }
  },
  uiReducer: {
    isSpinning: true
  },
  auth: {
    ids: [user.uid],
    entities: { [user.uid]: user },
    loading: false,
    loaded: true,
    error: undefined
  },
  users: {
    ids: userIds,
    entities: userEntities,
    loading: false,
    loaded: true,
    current: undefined,
    error: undefined
  }
};
