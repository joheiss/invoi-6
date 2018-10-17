import {UserData} from '../../auth/models/user';

export const mockAuth = (roles: string[] = ['sys-admin', 'sales-user']): UserData[] => {
  return [
    {
      displayName: 'Test Tester',
      email: 'test.tester@test.de',
      imageUrl: 'https://test.de/images/users/991OyAr37pNsS8BGHzidmOGAGVX2/thumbs/Passfoto_2014_1.jpg_64_thumb.png',
      isLocked: false,
      organization: 'THQ',
      phoneNumber: '+49 7771 234567',
      roles: roles,
      uid: '991OyAr37pNsS8BGHzidmOGAGVX2'
    }
  ];
};

export const mockAuthIds = (): string[] => {
  const allAuth = mockAuth();
  return allAuth.map(a => a.uid);
};

export const mockAuthEntity = (): any => {
  const allAuth = mockAuth();
  const entity = {};
  allAuth.map(a => entity[a.uid] = a);
  return entity;
};
