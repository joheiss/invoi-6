import {UserInfo} from 'firebase';
import {UserProfileData} from '../auth/models/user';
import {authAdapter, AuthState} from '../auth/store/reducers/auth.reducer';
import {userAdapter, UserState} from '../auth/store/reducers/users.reducer';
import {IdState} from '../auth/store/reducers';

export const generateAuth = (): UserInfo => {
  return {
    displayName: 'Teddy Tester',
    email: 'tester@test.de',
    phoneNumber: '+49 123 456789',
    photoURL: '',
    providerId: '',
    uid: 'tester@test.de_1234567890'
  };
};

export const generateUserProfile = (): UserProfileData => {
  const userInfo = generateAuth();
  return {
    displayName: userInfo.displayName,
    email: userInfo.email,
    phoneNumber: userInfo.phoneNumber,
    imageUrl: userInfo.photoURL,
    uid: userInfo.uid,
    roles: ['sales-user'],
    organization: 'GHQ',
    isLocked: false
  };
};

export const generateMoreUserProfiles = (count: number = 5): UserProfileData[] => {
  const users: UserProfileData[] = [] as UserProfileData[];
  for (let i = 0; i < count; i++) {
    const user = generateUserProfile();
    user.displayName = `${user.displayName} #${i.toString()}`;
    user.email = `${user.email} ${i.toString()}`;
    user.phoneNumber = `${user.phoneNumber} ${i.toString()}`;
    user.uid = `${user.uid}${i.toString()}`;
    users.push(user);
  }
  return users;
};

export const generateNewUser = (): UserProfileData => {
  const userData = generateUserProfile();
  userData.displayName = 'New User';
  userData.email = 'newuser@test.de';
  userData.phoneNumber = `${userData.phoneNumber}111`;
  userData.uid = undefined;
  return userData;
};

export const generateAuthState = (): AuthState => {
  const authUser = generateUserProfile();
  const authState = authAdapter.getInitialState();
  return authAdapter.addOne(authUser, {...authState, loading: false, loaded: true });
};

export const generateUsersStateWithOnlyAuthUser = (): UserState => {
  const authUser = generateUserProfile();
  const userState = userAdapter.getInitialState();
  return userAdapter.addOne(authUser, {...userState, loading: false, loaded: true });
};

export const generateUsersState = (): UserState => {
  const authUser = generateUserProfile();
  const userState = userAdapter.getInitialState();
  userAdapter.addOne(authUser, {...userState, loading: false, loaded: true });
  const moreUsers = generateMoreUserProfiles();
  return userAdapter.addMany(moreUsers, {...userState, loading: false, loaded: true });
};

export const generateIdStateWithOnlyAuthUser = (): IdState => {
  return {
    auth: generateAuthState(),
    users: generateUsersStateWithOnlyAuthUser()
  };
};

export const generateIdState = (): IdState => {
  return {
    auth: generateAuthState(),
    users: generateUsersState()
  };
};


